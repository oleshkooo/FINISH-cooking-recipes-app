import { ArgsType, Field, Int } from '@nestjs/graphql'

@ArgsType()
export class CursorConnectionArgs {
    @Field(() => Int, { nullable: true, defaultValue: 10 })
    limit: number

    @Field(() => Int, { nullable: true })
    nextPageCursor: number

    @Field(() => Int, { nullable: true })
    prevPageCursor: number
}
