import { AppController } from '@/app.controller'
import { RecipeTagEntity } from '@/entities/recipe-tag.entity'
import { RecipeEntity } from '@/entities/recipe.entity'
import { TagEntity } from '@/entities/tag.entity'
import { RecipeModule } from '@/recipe/recipe.module'
import { TagModule } from '@/tag/tag.module'
import { NODE_ENV_DEV, NODE_ENV_PROD } from '@/utils/NODE_ENV'
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'config'
import path from 'path'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            path: '/graphql',
            autoSchemaFile: path.join(process.cwd(), 'src/schema.gql'),
            sortSchema: false,
            playground: false,
            plugins: [
                NODE_ENV_PROD
                    ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
                    : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
            ],
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: config.get<string>('databaseUrl'),
            entities: [RecipeEntity, TagEntity, RecipeTagEntity],
            synchronize: NODE_ENV_DEV,
            cache: NODE_ENV_PROD,
            // logger: 'advanced-console',
            // logging: 'all',
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        RecipeModule,
        TagModule,
    ],
    controllers: [AppController],
})
export class AppModule {}
