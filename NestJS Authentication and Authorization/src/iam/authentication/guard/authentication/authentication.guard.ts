import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Reflector} from "@nestjs/core";
import {AccessTokenGuard} from "../../guards/access-token/access-token.guard";
import {AuthTypeEnum} from "../../enums/auth-type.enum";
import {ApiKeyGuard} from "../../guards/api-key/api-key.guard";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthTypeEnum.Bearer
  private readonly authTypeGuardMap: Record<AuthTypeEnum, CanActivate | CanActivate[]> = {
    [AuthTypeEnum.Bearer]: this.accessTokenGuard,
    [AuthTypeEnum.None]: {canActivate: () => true},
    [AuthTypeEnum.ApiKey]: this.apiKeyGuard,
  }

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const authTypes = this.reflector.getAllAndOverride<AuthTypeEnum[]>('authType', [
      context.getHandler(), context.getClass()
    ]) ?? [AuthenticationGuard.defaultAuthType]
    const guards = authTypes.flatMap((authType) => this.authTypeGuardMap[authType])
    const areActives = await Promise.all(guards.map(guard => guard.canActivate(context)))
    return areActives.every(result => result)
  }
}
