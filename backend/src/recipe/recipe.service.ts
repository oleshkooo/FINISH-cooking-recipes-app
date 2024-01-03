import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { GetByIdArgs } from '@/args/get-by-id.arg'
import { RecipeTagEntity } from '@/entities/recipe-tag.entity'
import { RecipeEntity } from '@/entities/recipe.entity'
import { TagEntity } from '@/entities/tag.entity'
import { IsSuccessResponseType } from '@/object-types/is-success-response.type'
import { DeleteRecipeArgs } from '@/recipe/args/delete-recipe.arg'
import { RecipesByTagsArgs } from '@/recipe/args/recipes-by-tags.arg'
import { RecipesByTitleArgs } from '@/recipe/args/recipes-by-title.arg'
import { CreateRecipeInput } from '@/recipe/inputs/create-recipe.input'
import { UpdateRecipeInput } from '@/recipe/inputs/update-recipe.input'
import { RecipeConnectionType } from '@/recipe/object-types/recipe-connection.type'
import { RecipeType } from '@/recipe/object-types/recipe.type'
import {
    getCursorLimit,
    getCursorPaginationCondition,
    getCursorOrderDirection,
    processCursorConnection,
} from '@/utils/cursor-connection'
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, In, Like, Repository } from 'typeorm'

@Injectable()
export class RecipeService {
    constructor(
        @InjectDataSource()
        private readonly dbDataSource: DataSource,
        @InjectRepository(RecipeEntity)
        private readonly recipeRepository: Repository<RecipeEntity>,
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
        @InjectRepository(RecipeTagEntity)
        private readonly recipeTagRepository: Repository<RecipeTagEntity>,
    ) {}

    //

    getConnection({ limit, nextPageCursor, prevPageCursor }: CursorConnectionArgs): Promise<RecipeConnectionType> {
        const whereCondition = getCursorPaginationCondition<RecipeEntity>()

        const getData = () =>
            this.recipeRepository.find({
                relations: {
                    tags: { tag: true },
                },
                where: whereCondition,
                take: getCursorLimit(limit),
                order: {
                    id: getCursorOrderDirection(prevPageCursor),
                },
            })

        return processCursorConnection<RecipeEntity, RecipeType>({
            limit,
            nextPageCursor,
            prevPageCursor,
            condition: whereCondition,
            getData,
            aggregateData: this.aggregateMany.bind(this),
        })
    }

    async getById({ id }: GetByIdArgs): Promise<RecipeType> {
        const item = await this.recipeRepository.findOne({
            relations: {
                tags: { tag: true },
            },
            where: { id },
        })
        if (!item) {
            throw new NotFoundException(`Recipe with ID ${id} not found`)
        }
        return this.aggregateOne(item)
    }

    findByTitle({ title, nextPageCursor, prevPageCursor, limit }: RecipesByTitleArgs): Promise<RecipeConnectionType> {
        const whereCondition = getCursorPaginationCondition<RecipeEntity>({
            title: Like(`%${title}%`),
        })

        const getData = () =>
            this.recipeRepository.find({
                relations: {
                    tags: { tag: true },
                },
                where: whereCondition,
                take: getCursorLimit(limit),
                order: {
                    id: getCursorOrderDirection(prevPageCursor),
                },
            })

        return processCursorConnection<RecipeEntity, RecipeType>({
            limit,
            nextPageCursor,
            prevPageCursor,
            condition: whereCondition,
            getData,
            aggregateData: this.aggregateMany.bind(this),
        })
    }

    findByTags({ tags, nextPageCursor, prevPageCursor, limit }: RecipesByTagsArgs): Promise<RecipeConnectionType> {
        const whereCondition = getCursorPaginationCondition<RecipeEntity>()

        const getData = async () => {
            const recipeIds = await this.recipeRepository.find({
                select: { id: true },
                relations: {
                    tags: { tag: true },
                },
                where: {
                    ...whereCondition,
                    tags: {
                        tag: { name: In(tags) },
                    },
                },
                take: getCursorLimit(limit),
                order: {
                    id: getCursorOrderDirection(prevPageCursor),
                },
            })
            return this.recipeRepository.find({
                relations: {
                    tags: { tag: true },
                },
                where: {
                    ...whereCondition,
                    id: In(recipeIds.map(({ id }) => id)),
                },
                take: getCursorLimit(limit),
                order: {
                    id: getCursorOrderDirection(prevPageCursor),
                },
            })
        }

        return processCursorConnection<RecipeEntity, RecipeType>({
            limit,
            nextPageCursor,
            prevPageCursor,
            condition: whereCondition,
            getData,
            aggregateData: this.aggregateMany.bind(this),
        })
    }

    async create({ tags: argTags, ...argData }: CreateRecipeInput): Promise<RecipeType> {
        const createdRecipe = this.recipeRepository.create(argData)
        await this.recipeRepository.save(createdRecipe)

        const uniqueTags = this.getUniqueTags(argTags)
        const existingTags = await this.tagRepository.findBy({ name: In(uniqueTags) })
        const existingTagNames = existingTags.map(tag => tag.name)
        const newTagNames = uniqueTags.filter(name => !existingTagNames.includes(name))
        const newTags = newTagNames.map(name => this.tagRepository.create({ name }))
        await this.tagRepository.save(newTags)

        const allTags = [...existingTags, ...newTags]
        const createdRecipeTags = allTags.map(tag =>
            this.recipeTagRepository.create({
                recipe: createdRecipe,
                tag,
            }),
        )
        await this.recipeTagRepository.save(createdRecipeTags)

        createdRecipe.tags = createdRecipeTags
        return this.aggregateOne(createdRecipe)
    }

    async update({ id, tags: argTags, ...argData }: UpdateRecipeInput): Promise<RecipeType> {
        const recipeToUpdate = await this.recipeRepository.findOne({
            where: { id },
            relations: {
                tags: { tag: true },
            },
        })
        if (!recipeToUpdate) {
            throw new NotFoundException(`Recipe with ID ${id} not found`)
        }

        Object.assign(recipeToUpdate, argData)
        await this.recipeRepository.save(recipeToUpdate)

        if (argTags) {
            const uniqueTags = this.getUniqueTags(argTags)
            const tagsToRemove = recipeToUpdate.tags.filter(rt => !uniqueTags.includes(rt.tag.name))
            await this.recipeTagRepository.remove(tagsToRemove)

            const existingTags = await this.tagRepository.findBy({ name: In(uniqueTags) })
            const newTagNames = uniqueTags.filter(name => !existingTags.map(tag => tag.name).includes(name))
            const newTags = newTagNames.map(name => this.tagRepository.create({ name }))
            await this.tagRepository.save(newTags)

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
