import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class IsSuccessType {
    @Field(() => Boolean)
    isSuccess: boolean
}
