import { RecipeTagEntity } from '@/entities/recipe-tag.entity'
import { IngredientType } from '@/recipe/object-types/ingredient.type'
import _ from 'lodash'
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

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

    //

    @Column()
    title: string

    @BeforeInsert()
    @BeforeUpdate()
    capitalizeTitle() {
        this.title = _.capitalize(this.title)
    }

    //

    @Column({ type: 'json' })
    ingredients: IngredientType[]

    @BeforeInsert()
    @BeforeUpdate()
    removeIngredientsDuplicates() {
        this.ingredients = _.uniqWith(this.ingredients, (a, b) => a.name === b.name)
    }

    @BeforeInsert()
    @BeforeUpdate()
    capitalizeIngredients() {
        this.ingredients = this.ingredients.map(item => ({
            ...item,
            name: _.capitalize(item.name),
        }))
    }

    //

    @Column()
    directions: string

    //

    @OneToMany(() => RecipeTagEntity, recipeTag => recipeTag.recipe)
    tags: RecipeTagEntity[]
}
