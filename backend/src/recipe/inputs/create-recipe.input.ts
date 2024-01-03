import { RecipeInput } from '@/recipe/object-types/recipe.type'
import { InputType, OmitType } from '@nestjs/graphql'

@InputType()
export class CreateRecipeInput extends OmitType(RecipeInput, ['id'] as const) {}
