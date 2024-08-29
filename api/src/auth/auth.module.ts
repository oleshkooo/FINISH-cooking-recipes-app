import { JwtStrategy } from '@/auth/strategy/jwt.strategy'
import { UserEntity } from '@/db/entities/user.entity'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import config from 'config'

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.register({
            global: true,
            secret: config.get<string>('auth.secret'),
            signOptions: {
                expiresIn: '21d',
            },
        }),
        TypeOrmModule.forFeature([UserEntity]),
    ],
    providers: [JwtStrategy],
})
export class AuthModule {}
