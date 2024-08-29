import { RecipeInput } from '@/endpoints/recipe/gql/recipe.gql'
import { InputType, PartialType } from '@nestjs/graphql'

@InputType()
export class UpdateRecipeInput extends PartialType(RecipeInput, InputType) {}
