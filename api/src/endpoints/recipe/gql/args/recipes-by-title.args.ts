import { CursorConnectionArgs } from '@/common/gql/args/cursor-connection.args'
import { ArgsType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@ArgsType()
export class RecipesByTitleConnectionArgs extends CursorConnectionArgs {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    title: string
}
