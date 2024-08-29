import { ArgsType, Field, Int } from '@nestjs/graphql'
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator'

@ArgsType()
export class CursorConnectionArgs {
    @Field(() => Int, { defaultValue: 10 })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit: number = 10

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    @IsInt()
    @Min(0)
    nextPageCursor?: number
}
