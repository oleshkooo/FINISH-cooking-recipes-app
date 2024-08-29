import { CurrentUser, ICurrentUser } from '@/auth/decorators/current-user.decorator'
import { CursorConnectionArgs } from '@/common/gql/args/cursor-connection.args'
import { IdArgs } from '@/common/gql/args/id.args'
import { RecipeEntity, RecipeEntityCreate } from '@/db/entities/recipe.entity'
import { TagEntity, TagEntityCreate } from '@/db/entities/tag.entity'
import { UserEntity } from '@/db/entities/user.entity'
import { RecipesByTagsArgs } from '@/endpoints/recipe/gql/args/recipes-by-tags.args'
import { RecipesByTitleConnectionArgs } from '@/endpoints/recipe/gql/args/recipes-by-title.args'
import { RecipeInput, RecipeType } from '@/endpoints/recipe/gql/recipe.gql'
import { RecipeConnectionType } from '@/endpoints/recipe/gql/types/recipe-connection.type'
import { connectionAgg, getNextPageCursorFromNodes } from '@/utils/connection-agg'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { Builder, StrictBuilder } from 'builder-pattern'
import _ from 'lodash'
import { DataSource, In, Like, MoreThan, Repository } from 'typeorm'

@Injectable()
export class RecipeService {
    constructor(
        @InjectDataSource()
        private readonly dbDataSource: DataSource,
        @InjectRepository(RecipeEntity)
        private readonly recipeEntity: Repository<RecipeEntity>,
        @InjectRepository(TagEntity)
        private readonly tagEntity: Repository<TagEntity>,
    ) {}

    //

    // getConnection(args: CursorConnectionArgs): Promise<RecipeConnectionType> {
    //     const whereCondition = getCursorPaginationCondition<RecipeEntity>()

    //     const getData = () =>
    //         this.recipeRepository.find({
    //             relations: {
    //                 tags: { tag: true },
    //             },
    //             where: whereCondition,
    //             take: getCursorLimit(limit),
    //             order: {
    //                 id: getCursorOrderDirection(prevPageCursor),
    //             },
    //         })

    //     return processCursorConnection<RecipeEntity, RecipeType>({
    //         limit,
    //         nextPageCursor,
    //         prevPageCursor,
    //         condition: whereCondition,
    //         getData,
    //         aggregateData: this.aggregateMany.bind(this),
    //     })
    // }

    async recipesConnection(args: CursorConnectionArgs): Promise<RecipeConnectionType> {
        const nodes = await this.recipeEntity.find({
            relations: {
                tags: true,
            },
            where: {
                id: MoreThan(args.nextPageCursor || 0),
            },
            take: args.limit,
            order: {
                id: 'ASC',
            },
        })
        return connectionAgg(nodes, args)
    }

    async recipe(args: IdArgs): Promise<RecipeType> {
        const node = await this.recipeEntity.findOne({
            relations: { tags: true },
            where: { id: args.id },
        })
        if (!node) {
            throw new NotFoundException(`Recipe with ID ${args.id} not found`)
        }
        return node
    }

    async recipesByTitle(args: RecipesByTitleConnectionArgs): Promise<RecipeConnectionType> {
        const nodes = await this.recipeEntity.find({
            relations: { tags: true },
            where: {
                id: MoreThan(args.nextPageCursor || 0),
                title: Like(`%${args.title}%`),
            },
            take: args.limit,
            order: { id: 'ASC' },
        })
        return connectionAgg(nodes, args)
    }

    async recipesByTags(args: RecipesByTagsArgs): Promise<RecipeConnectionType> {
        const nodes = await this.recipeEntity.find({
            relations: { tags: true },
            where: {
                id: MoreThan(args.nextPageCursor || 0),
                tags: { name: In(args.tags) },
            },
            take: args.limit,
            order: { id: 'ASC' },
        })
        return connectionAgg(nodes, args)
    }

    async createRecipe(args: RecipeInput, currentUser: ICurrentUser): Promise<RecipeType> {
        const lowerCaseTags = args.tags.map(tag => tag.toLowerCase())
        const uniqueTags = _.uniq(lowerCaseTags)
        const existingTags = await this.tagEntity
            .find({
                where: { name: In(uniqueTags) },
            })
            .then(tags => tags.map(tag => tag.name))
        const tagsToCreate = uniqueTags.filter(tag => !existingTags.includes(tag))
        const createdTags = await Promise.all(
            tagsToCreate.map(tag => {
                const entity = StrictBuilder<TagEntityCreate>().name(tag).build()
                return this.tagEntity.create(entity)
            }),
        )

        const createdRecipe = this.recipeEntity.save(
            StrictBuilder<RecipeEntityCreate>()
                .title(args.title)
                .ingredients(args.ingredients)
                .directions(args.directions)
                .tags(createdTags)
                .user(currentUser)
                .build(),
        )
        // TODO doublecheck
        return {
            ...createdRecipe,
            tags: createdTags.map(tag => tag.name),
        }
    }

    async update({ id, tags: argTags, ...argData }: UpdateRecipeInput): Promise<RecipeType> {
        const recipeToUpdate = await this.recipeEntity.findOne({
            where: { id },
            relations: {
                tags: { tag: true },
            },
        })
        if (!recipeToUpdate) {
            throw new NotFoundException(`Recipe with ID ${id} not found`)
        }

        Object.assign(recipeToUpdate, argData)
        await this.recipeEntity.save(recipeToUpdate)

        if (argTags) {
            const uniqueTags = this.getUniqueTags(argTags)
            const tagsToRemove = recipeToUpdate.tags.filter(rt => !uniqueTags.includes(rt.tag.name))
            await this.recipeTagRepository.remove(tagsToRemove)

            const existingTags = await this.tagEntity.findBy({ name: In(uniqueTags) })
            const newTagNames = uniqueTags.filter(name => !existingTags.map(tag => tag.name).includes(name))
            const newTags = newTagNames.map(name => this.tagEntity.create({ name }))
            await this.tagEntity.save(newTags)

            const newRecipeTags = newTags.map(tag => this.recipeTagRepository.create({ recipe: recipeToUpdate, tag }))
            await this.recipeTagRepository.save(newRecipeTags)

            recipeToUpdate.tags = [...recipeToUpdate.tags.filter(rt => !tagsToRemove.includes(rt)), ...newRecipeTags]
        }

        return this.aggregateOne(recipeToUpdate)
    }

    async delete({ id }: DeleteRecipeArgs): Promise<IsSuccessResponseType> {
        await this.dbDataSource.transaction(async manager => {
            const recipe = await manager.findOneBy(RecipeEntity, { id })
            if (!recipe) {
                throw new NotFoundException(`Recipe with ID ${id} not found`)
            }

            const recipeTags = await manager.findBy(RecipeTagEntity, { recipe: { id } })
            await manager.remove(recipeTags)

            await manager.remove(recipe)
        })
        return new IsSuccessResponseType(true)
    }

    //

    aggregateOne(recipe: RecipeEntity): RecipeType {
        return {
            ...recipe,
            tags: recipe.tags.map(({ tag }) => tag.name),
        }
    }

    aggregateMany(recipes: RecipeEntity[]): RecipeType[] {
        return recipes.map(recipe => this.aggregateOne(recipe))
    }

    getUniqueTags(tags: string[]): string[] {
        return [...new Set(tags)]
    }
}
