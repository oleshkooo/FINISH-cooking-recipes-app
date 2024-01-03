import { PageInfoType } from '@/object-types/page-info.type'
import { TagType } from '@/tag/object-types/tag.type'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsArray } from 'class-validator'

@ObjectType()
export class TagConnectionType {
    @IsArray()
    @Field(() => [TagType])
    nodes: TagType[]

    @Field(() => PageInfoType)
    pageInfo: PageInfoType
}
