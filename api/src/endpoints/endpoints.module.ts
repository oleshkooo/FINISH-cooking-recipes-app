import { RecipeModule } from '@/endpoints/recipe/recipe.module'
import { TagModule } from '@/endpoints/tag/tag.module'
import { UserModule } from '@/endpoints/user/user.module'
import { Module } from '@nestjs/common'

@Module({
    imports: [UserModule, RecipeModule, TagModule],
})
export class GraphQLEndpointsModule {}
