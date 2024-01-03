import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { ArgsType, Field } from '@nestjs/graphql'
import { IsArray } from 'class-validator'

@ArgsType()
export class RecipesByTagsArgs extends CursorConnectionArgs {
    @IsArray()
    @Field(() => [String])
    tags: string[]
}
