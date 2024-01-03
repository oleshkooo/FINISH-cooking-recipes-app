import { RecipeInput } from '@/recipe/object-types/recipe.type'
import { InputType, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/graphql'

@InputType()
export class UpdateRecipeInput extends IntersectionType(
    PickType(RecipeInput, ['id'] as const),
    PartialType(OmitType(RecipeInput, ['id'] as const)),
) {}
