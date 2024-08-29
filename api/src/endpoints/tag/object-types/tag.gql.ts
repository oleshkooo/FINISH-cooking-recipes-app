import { Field, InputType, Int, ObjectType } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@InputType()
@ObjectType({ isAbstract: true })
export class TagInput {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string
}

@ObjectType()
export class TagType extends TagInput {
    @Field(() => Int)
    id: number
}
