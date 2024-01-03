import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { ArgsType, Field } from '@nestjs/graphql'
import { IsNotEmpty, IsString } from 'class-validator'

@ArgsType()
export class RecipesByTitleArgs extends CursorConnectionArgs {
    @IsString()
    @IsNotEmpty()
    @Field(() => String)
    title: string
}
