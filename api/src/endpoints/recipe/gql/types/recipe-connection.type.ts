import { PageInfoType } from '@/common/gql/types/page-info.type'
import { RecipeType } from '@/endpoints/recipe/gql/recipe.gql'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsArray } from 'class-validator'

@ObjectType()
export class RecipeConnectionType {
    @Field(() => [RecipeType])
    nodes: RecipeType[]

    @Field(() => PageInfoType)
    pageInfo: PageInfoType
}
