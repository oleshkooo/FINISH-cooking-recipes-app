import { CurrentUser, ICurrentUser } from '@/auth/decorators/current-user.decorator'
import { CursorConnectionArgs } from '@/common/gql/args/cursor-connection.args'
import { IdArgs } from '@/common/gql/args/id.args'
import { IsSuccessType } from '@/common/gql/types/is-success.type'
import { UserEntity } from '@/db/entities/user.entity'
import { RecipesByTagsArgs } from '@/endpoints/recipe/gql/args/recipes-by-tags.args'
import { RecipesByTitleConnectionArgs } from '@/endpoints/recipe/gql/args/recipes-by-title.args'
import { UpdateRecipeInput } from '@/endpoints/recipe/gql/inputs/update-recipe.input'
import { RecipeInput, RecipeType } from '@/endpoints/recipe/gql/recipe.gql'
import { RecipeConnectionType } from '@/endpoints/recipe/gql/types/recipe-connection.type'
import { RecipeService } from '@/endpoints/recipe/recipe.service'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver(() => RecipeType)
export class RecipeResolver {
    constructor(private readonly recipeService: RecipeService) {}

    //

    @Query(() => RecipeConnectionType)
    recipesConnection(@Args({ type: () => CursorConnectionArgs }) args: CursorConnectionArgs): Promise<RecipeConnectionType> {
        return this.recipeService.recipesConnection(args)
    }

    @Query(() => RecipeType)
    recipe(@Args({ type: () => IdArgs }) args: IdArgs): Promise<RecipeType> {
        return this.recipeService.recipe(args)
    }

    @Query(() => RecipeConnectionType)
    recipesByTitle(
        @Args({ type: () => RecipesByTitleConnectionArgs }) args: RecipesByTitleConnectionArgs,
    ): Promise<RecipeConnectionType> {
        return this.recipeService.recipesByTitle(args)
    }

    @Query(() => RecipeConnectionType)
    recipesByTags(@Args({ type: () => RecipesByTagsArgs }) args: RecipesByTagsArgs): Promise<RecipeConnectionType> {
        return this.recipeService.recipesByTags(args)
    }

    //

    @Mutation(() => RecipeType)
    createRecipe(
        @CurrentUser() currentUser: ICurrentUser,
        @Args('recipe', { type: () => RecipeInput }) recipe: RecipeInput,
    ): Promise<RecipeType> {
        return this.recipeService.createRecipe(recipe, currentUser)
    }

    @Mutation(() => RecipeType)
    updateRecipe(@Args('recipe', { type: () => UpdateRecipeInput }) recipe: UpdateRecipeInput): Promise<RecipeType> {
        return this.recipeService.update(recipe)
    }

    @Mutation(() => IsSuccessType)
    deleteRecipe(@Args({ type: () => IdArgs }) args: IdArgs): Promise<IsSuccessType> {
        return this.recipeService.delete(args)
    }
}
