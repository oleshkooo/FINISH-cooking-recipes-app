import { IngredientInput, IngredientType } from '@/recipe/object-types/ingredient.type'
import { ArgsType, Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql'
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'

@ObjectType()
export class RecipeType {
    @IsNumber()
    @Field(() => Int)
    id: number

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    title: string

    @IsArray()
    @Field(() => [IngredientType])
    ingredients: IngredientType[]

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    directions: string

    @IsArray()
    @Field(() => [String])
    tags: string[]
}

@InputType()
export class RecipeInput extends OmitType(RecipeType, ['ingredients'] as const) {
    @IsArray()
    @Field(() => [IngredientInput])
    ingredients: IngredientInput[]
}

@ArgsType()
export class RecipeArgs extends OmitType(RecipeInput, ['ingredients'] as const) {
    @IsArray()
    @Field(() => [IngredientInput])
    ingredients: IngredientInput[]
}
