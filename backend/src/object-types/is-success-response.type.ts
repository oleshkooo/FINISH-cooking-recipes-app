import { Field, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@ObjectType()
export class IsSuccessResponseType {
    constructor(isSuccess: boolean) {
        this.isSuccess = isSuccess
    }

    //

    @IsBoolean()
    @Field(() => Boolean)
    isSuccess: boolean
}
