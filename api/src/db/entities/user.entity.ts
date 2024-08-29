import { RecipeEntity } from '@/db/entities/recipe.entity'
import { OmitMethods, PartialSome } from '@/utils/type-helpers'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    password: string

    @OneToMany(() => RecipeEntity, recipe => recipe.user)
    recipes: RecipeEntity[]
}

export type UserEntityCreate = PartialSome<Omit<OmitMethods<UserEntity>, 'id'>, 'recipes'>
