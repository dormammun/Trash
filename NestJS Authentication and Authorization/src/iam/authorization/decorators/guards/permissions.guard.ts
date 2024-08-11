import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import  {Reflector} from "@nestjs/core";
import type {PermissionType} from "../../../authentication/permission.type";
import type {UserEntity} from "../../../../users/entities/user.entity";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const permissions = this.reflector.getAllAndOverride<PermissionType[] | undefined>('permissions', [
      context.getHandler(),
      context.getClass()
    ])

    if (!permissions) {
      return true;
    }

    const user: UserEntity = context.switchToHttp().getRequest()['activeUser'];
    return permissions.every(pm => user.permissions?.includes(pm))
  }
}
