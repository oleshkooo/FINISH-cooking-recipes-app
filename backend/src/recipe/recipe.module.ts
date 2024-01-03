import { RecipeTagEntity } from '@/entities/recipe-tag.entity'
import { RecipeEntity } from '@/entities/recipe.entity'
import { TagEntity } from '@/entities/tag.entity'
import { RecipeResolver } from '@/recipe/recipe.resolver'
import { RecipeService } from '@/recipe/recipe.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([RecipeEntity, TagEntity, RecipeTagEntity])],
    providers: [RecipeResolver, RecipeService],
})
export class RecipeModule {}
