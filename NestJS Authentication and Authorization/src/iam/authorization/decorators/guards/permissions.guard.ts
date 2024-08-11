import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { Observable } from "rxjs"

import type { UserEntity } from "../../../../users/entities/user.entity"
import type { PermissionType } from "../../../authentication/permission.type"

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Observable<boolean> | Promise<boolean> {
    const permissions = this.reflector.getAllAndOverride<
      PermissionType[] | undefined
    >("permissions", [context.getHandler(), context.getClass()])

    if (!permissions) {
      return true
    }

    const user: UserEntity = context.switchToHttp().getRequest()["activeUser"]
    return permissions.every((pm) => user.permissions?.includes(pm))
  }
}
