import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { ArgsType, Field } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@ArgsType()
export class TagsPredictionArgs extends CursorConnectionArgs {
    @IsString()
    @Field(() => String)
    name: string
}
