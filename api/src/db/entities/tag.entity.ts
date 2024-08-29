import { RecipeEntity } from '@/db/entities/recipe.entity'
import { OmitMethods, PartialSome } from '@/utils/type-helpers'
import _ from 'lodash'
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

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

    @Column()
    name: string
    @BeforeInsert()
    @BeforeUpdate()
    lowercaseName() {
        this.name = this.name.toLowerCase()
    }

    @ManyToMany(() => RecipeEntity, recipe => recipe.tags)
    recipes: RecipeEntity[]
}

export type TagEntityCreate = PartialSome<Omit<OmitMethods<TagEntity>, 'id'>, 'recipes'>
