import { CurrentUser, ICurrentUser } from '@/auth/decorators/current-user.decorator'
import { GqlAuthGuard } from '@/auth/guards/gql-auth.guard'
import { AuthResponseType } from '@/endpoints/user/dto/auth-response.type'
import { LoginInput } from '@/endpoints/user/dto/login.input'
import { RegisterInput } from '@/endpoints/user/dto/register.input'
import { UserType } from '@/endpoints/user/dto/user.type'
import { UserService } from '@/endpoints/user/user.service'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

@Resolver(() => UserType)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserType)
    @UseGuards(GqlAuthGuard)
    me(@CurrentUser() currentUser: ICurrentUser): Promise<UserType> {
        return this.userService.me(currentUser)
    }

    @Mutation(() => AuthResponseType)
    login(@Args({ name: 'user', type: () => LoginInput }) userData: LoginInput): Promise<AuthResponseType> {
        return this.userService.login(userData)
    }

    @Mutation(() => AuthResponseType)
    register(@Args({ name: 'user', type: () => RegisterInput }) userData: RegisterInput): Promise<AuthResponseType> {
        return this.userService.register(userData)
    }
}
