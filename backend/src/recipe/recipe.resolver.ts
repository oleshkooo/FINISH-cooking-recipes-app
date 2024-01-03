import { CursorConnectionArgs } from '@/args/cursor-connection.arg'
import { GetByIdArgs } from '@/args/get-by-id.arg'
import { IsSuccessResponseType } from '@/object-types/is-success-response.type'
import { DeleteRecipeArgs } from '@/recipe/args/delete-recipe.arg'
import { RecipesByTagsArgs } from '@/recipe/args/recipes-by-tags.arg'
import { RecipesByTitleArgs } from '@/recipe/args/recipes-by-title.arg'
import { CreateRecipeInput } from '@/recipe/inputs/create-recipe.input'
import { UpdateRecipeInput } from '@/recipe/inputs/update-recipe.input'
import { RecipeConnectionType } from '@/recipe/object-types/recipe-connection.type'
import { RecipeType } from '@/recipe/object-types/recipe.type'
import { RecipeService } from '@/recipe/recipe.service'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver(() => RecipeType)
export class RecipeResolver {
    constructor(private readonly recipeService: RecipeService) {}

    //

    @Query(() => RecipeConnectionType)
    recipesConnection(@Args({ type: () => CursorConnectionArgs }) args: CursorConnectionArgs): Promise<RecipeConnectionType> {
        return this.recipeService.getConnection(args)
    }

    @Query(() => RecipeType)
    recipe(@Args({ type: () => GetByIdArgs }) args: GetByIdArgs): Promise<RecipeType> {
        return this.recipeService.getById(args)
    }

    @Query(() => RecipeConnectionType)
    recipesByTitle(@Args({ type: () => RecipesByTitleArgs }) args: RecipesByTitleArgs): Promise<RecipeConnectionType> {
        return this.recipeService.findByTitle(args)
    }

    @Query(() => RecipeConnectionType)
    recipesByTags(@Args({ type: () => RecipesByTagsArgs }) args: RecipesByTagsArgs): Promise<RecipeConnectionType> {
        return this.recipeService.findByTags(args)
    }

    //

    @Mutation(() => RecipeType)
    createRecipe(@Args('recipe', { type: () => CreateRecipeInput }) recipe: CreateRecipeInput): Promise<RecipeType> {
        return this.recipeService.create(recipe)
    }

    @Mutation(() => RecipeType)
    updateRecipe(@Args('recipe', { type: () => UpdateRecipeInput }) recipe: UpdateRecipeInput): Promise<RecipeType> {
        return this.recipeService.update(recipe)
    }

    @Mutation(() => IsSuccessResponseType)
    deleteRecipe(@Args({ type: () => DeleteRecipeArgs }) args: DeleteRecipeArgs): Promise<IsSuccessResponseType> {
        return this.recipeService.delete(args)
    }
}
