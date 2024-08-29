import { CursorConnectionArgs } from '@/common/gql/args/cursor-connection.args'
import { ArgsType, Field, PickType } from '@nestjs/graphql'
import { IsArray, IsString } from 'class-validator'

@ArgsType()
export class RecipesByTagsConnectionArgs extends CursorConnectionArgs {
    @Field(() => [String])
    @IsArray()
    @IsString({ each: true })
    tags: string[]
}
