import { AuthModule } from '@/auth/auth.module'
import { GraphQLEndpointsModule } from '@/endpoints/endpoints.module'
import { ENV } from '@/utils/env'
import {
    ApolloServerPluginLandingPageLocalDefault,
    ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'config'
import { join } from 'path'

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            path: '/graphql',
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            sortSchema: false,
            playground: false,
            introspection: true,
            plugins: [
                ENV.isProd()
                    ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
                    : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
            ],
            includeStacktraceInErrorResponses: !ENV.isProd(),
        }),
        TypeOrmModule.forRoot({
            type: 'sqlite',
            database: config.get<string>('db.url'),
            entities: [join(__dirname, '**', '*.entity.{js,ts}')],
            synchronize: ENV.isDev(),
            cache: ENV.isDev(),
        }),
        AuthModule,
        GraphQLEndpointsModule,
    ],
})
export class AppModule {}
