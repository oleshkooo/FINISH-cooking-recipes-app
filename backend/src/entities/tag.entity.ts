import { RecipeTagEntity } from '@/entities/recipe-tag.entity'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

export const TAG_TABLE_NAME = 'tag'
export const TAG_TABLE_FIELDS = {
    id: 'id',
    name: 'name',
    recipes: 'recipes',
}

@Entity()
export class TagEntity {
    @PrimaryGeneratedColumn()
    id: number

    //

    @Column()
    name: string

    //

    @OneToMany(() => RecipeTagEntity, recipeTag => recipeTag.tag)
    recipes: RecipeTagEntity[]
}
