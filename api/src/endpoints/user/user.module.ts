import { AuthService } from '@/auth/auth.service'
import { UserEntity } from '@/db/entities/user.entity'
import { UserResolver } from '@/endpoints/user/user.resolver'
import { UserService } from '@/endpoints/user/user.service'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserResolver, UserService, AuthService],
})
export class UserModule {}
