import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import  {Reflector} from "@nestjs/core";
import type {RoleEnum} from "../../../../../users/enums/role.enum";
import type {UserEntity} from "../../../../../users/entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<RoleEnum[] | undefined>('roles', [
      context.getHandler(),
      context.getClass()
    ])

    if (!roles) {
      return true;
    }

    const user: UserEntity = context.switchToHttp().getRequest()['activeUser'];
    return roles.includes(user.role);
  }
}
