import { AuthService } from '@/auth/auth.service'
import { UserEntity } from '@/db/entities/user.entity'
import { LoginInput } from '@/endpoints/user/dto/login.input'
import { RegisterInput } from '@/endpoints/user/dto/register.input'
import { AuthResponseType } from '@/endpoints/user/dto/auth-response.type'
import { UserType } from '@/endpoints/user/dto/user.type'
import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import bcrypt from 'bcrypt'
import config from 'config'
import { Repository } from 'typeorm'
import { ICurrentUser } from '@/auth/decorators/current-user.decorator'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userEntity: Repository<UserEntity>,
        private readonly authService: AuthService,
    ) {}

    async me(currentUser: ICurrentUser): Promise<UserType> {
        return currentUser
    }

    async login(userData: LoginInput): Promise<AuthResponseType> {
        const user = await this.userEntity.findOne({
            where: {
                email: userData.email,
            },
        })
        if (!user) {
            throw new NotFoundException('User not found')
        }
        const passwordMatch = await bcrypt.compare(userData.password, user.password)
        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid password')
        }
        const token = await this.authService.generateJwt(user.id)
        return {
            token,
            user,
        }
    }

    async register(userData: RegisterInput): Promise<AuthResponseType> {
        const existingUser = await this.userEntity.findOne({
            where: {
                email: userData.email,
            },
        })
        if (existingUser) {
            throw new ConflictException('User already exists')
        }
        const saltOrRounds = config.get<number>('auth.saltOrRounds')
        const hash = await bcrypt.hash(userData.password, saltOrRounds)
        const newUser = await this.userEntity.save({
            ...userData,
            password: hash,
        })
        const token = await this.authService.generateJwt(newUser.id)
        return {
            token,
            user: newUser,
        }
    }
}
