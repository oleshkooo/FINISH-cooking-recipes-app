import { Field, InputType, Int, ObjectType, OmitType } from '@nestjs/graphql'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

@InputType()
@ObjectType({ isAbstract: true })
export class UserInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    password: string
}

@ObjectType()
export class UserType extends OmitType(UserInput, ['password'] as const, ObjectType) {
    @Field(() => Int)
    id: number
}
