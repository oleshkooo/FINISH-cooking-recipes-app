import { TagEntity } from '@/db/entities/tag.entity'
import { IngredientInput, IngredientType } from '@/endpoints/recipe/gql/ingredient.gql'
import { TagInput, TagType } from '@/endpoints/tag/object-types/tag.gql'
import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsArray, IsNotEmpty, IsObject, IsString } from 'class-validator'

@InputType()
@ObjectType({ isAbstract: true })
export class RecipeInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    directions: string

    @Field(() => [IngredientInput])
    @IsArray()
    @IsObject({ each: true })
    ingredients: IngredientInput[]

    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    tags: string[]
}

@ObjectType()
export class RecipeType extends OmitType(RecipeInput, ['ingredients', 'tags'] as const, ObjectType) {
    @Field(() => Int)
    id: number

    @Field(() => [IngredientType])
    ingredients: IngredientType[]

    @Field(() => [TagType])
    tags: TagType[]
}
