import { TagEntity } from '@/db/entities/tag.entity'
import { UserEntity } from '@/db/entities/user.entity'
import { IngredientType } from '@/endpoints/recipe/gql/ingredient.gql'
import { OmitMethods, PartialSome } from '@/utils/type-helpers'
import _ from 'lodash'
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

export const RECIPE_TABLE_NAME = 'recipe'
export const RECIPE_TABLE_FIELDS = {
    id: 'id',
    title: 'title',
    ingredients: 'ingredients',
    directions: 'directions',
    tags: 'tags',
}

@Entity()
export class RecipeEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string
    @BeforeInsert()
    @BeforeUpdate()
    lowercaseTitle() {
        this.title = this.title.toLowerCase()
    }

    @Column({ type: 'json' })
    ingredients: IngredientType[]
    @BeforeInsert()
    @BeforeUpdate()
    processIngredients() {
        // remove duplicates
        this.ingredients = _.uniqWith(this.ingredients, (a, b) => a.name === b.name)
        // lowercase ingredient names
        this.ingredients = this.ingredients.map(ingredient => ({
            ...ingredient,
            name: ingredient.name.toLowerCase(),
        }))
    }

    @Column()
    directions: string

    @ManyToMany(() => TagEntity, tag => tag.recipes)
    @JoinTable()
    tags: TagEntity[]

    @ManyToOne(() => UserEntity, user => user.recipes)
    user: UserEntity
}

export type RecipeEntityCreate = PartialSome<Omit<OmitMethods<RecipeEntity>, 'id'>, 'tags' | 'user'>
