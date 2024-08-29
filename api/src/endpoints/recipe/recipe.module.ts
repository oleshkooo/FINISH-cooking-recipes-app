import { RecipeEntity } from '@/db/entities/recipe.entity'
import { TagEntity } from '@/db/entities/tag.entity'
import { RecipeResolver } from '@/endpoints/recipe/recipe.resolver'
import { RecipeService } from '@/endpoints/recipe/recipe.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([RecipeEntity, TagEntity])],
    providers: [RecipeResolver, RecipeService],
})
export class RecipeModule {}
