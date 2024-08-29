import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
@ObjectType({ isAbstract: true })
export class IngredientInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    quantity: string
}

@ObjectType()
export class IngredientType extends IngredientInput {}
