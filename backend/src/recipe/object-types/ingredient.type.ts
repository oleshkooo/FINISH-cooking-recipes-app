import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@ObjectType()
export class IngredientType {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    name: string

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    quantity: string
}

@InputType()
export class IngredientInput {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    name: string

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    quantity: string
}
