import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

@ObjectType()
export class TagType {
    @IsNumber()
    @Field(() => Int)
    id: number

    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    name: string
}

@InputType()
export class TagInput {}

@ArgsType()
export class TagsArgs {}
