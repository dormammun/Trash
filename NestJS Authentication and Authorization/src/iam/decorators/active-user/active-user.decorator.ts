import { createParamDecorator, type ExecutionContext } from "@nestjs/common"

import type { UserEntity } from "../../../users/entities/user.entity"

export const ActiveUser = createParamDecorator(
  (field: keyof UserEntity | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    const user: undefined | UserEntity = request["activeUser"]
    return field ? user?.[field] : user
  }
)
