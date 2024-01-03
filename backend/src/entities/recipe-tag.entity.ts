import { RecipeEntity } from '@/entities/recipe.entity'
import { TagEntity } from '@/entities/tag.entity'
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class RecipeTagEntity {
    @PrimaryGeneratedColumn()
    id: number

    @ManyToOne(() => RecipeEntity, recipe => recipe.tags)
    recipe: RecipeEntity

    @ManyToOne(() => TagEntity, tag => tag.recipes)
    tag: TagEntity
}
