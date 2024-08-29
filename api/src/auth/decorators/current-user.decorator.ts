import { UserEntity } from '@/db/entities/user.entity'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'

export type ICurrentUser = UserEntity

export const CurrentUser = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context)
    return ctx.getContext().req.user
})
