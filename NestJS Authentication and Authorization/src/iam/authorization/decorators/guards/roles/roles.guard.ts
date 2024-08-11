import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Observable } from "rxjs"

import type { UserEntity } from "../../../../../users/entities/user.entity"
import type { RoleEnum } from "../../../../../users/enums/role.enum"

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Observable<boolean> | Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<RoleEnum[] | undefined>(
      "roles",
      [context.getHandler(), context.getClass()]
    )

    if (!roles) {
      return true
    }

    const user: UserEntity = context.switchToHttp().getRequest()["activeUser"]
    return roles.includes(user.role)
  }
}
