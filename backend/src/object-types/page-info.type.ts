import { Field, Int, ObjectType } from '@nestjs/graphql'
import { IsBoolean, IsNumber } from 'class-validator'

@ObjectType()
export class PageInfoType {
    @IsNumber()
    @Field(() => Number)
    limit: number

    @IsBoolean()
    @Field(() => Boolean)
    hasNextPage: boolean

    @IsNumber()
    @Field(() => Int, { nullable: true })
    nextPageCursor: number | null

    @IsBoolean()
    @Field(() => Boolean)
    hasPrevPage: boolean

    @IsNumber()
    @Field(() => Int, { nullable: true })
    prevPageCursor: number | null
}
