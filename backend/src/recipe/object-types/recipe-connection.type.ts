import { PageInfoType } from '@/object-types/page-info.type'
import { RecipeType } from '@/recipe/object-types/recipe.type'
import { Field, ObjectType } from '@nestjs/graphql'
import { IsArray } from 'class-validator'

@ObjectType()
export class RecipeConnectionType {
    @IsArray()
    @Field(() => [RecipeType])
    nodes: RecipeType[]

    @Field(() => PageInfoType)
    pageInfo: PageInfoType
}
