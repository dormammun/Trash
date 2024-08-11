import {CanActivate, ExecutionContext, ForbiddenException, Injectable, type Type} from '@nestjs/common';
import type {Policy} from "./policy.interface";
import  {Reflector} from "@nestjs/core";
import  {PolicyHandlerStorage} from "./policy-handler.storage";


@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly policyHandlerStorage: PolicyHandlerStorage,
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const policies = this.reflector.getAllAndOverride<Policy[] | undefined>('policies', [
      context.getHandler(),
      context.getClass()
    ])
    const user = context.switchToHttp().getRequest()['activeUser'];
    if (!policies) {
      return true
    }
    try {
      for (const policy of policies) {
        const handler = this.policyHandlerStorage.get(policy.constructor as Type);
        await handler.handler(policy, user);
      }
      return true;
    } catch (e) {
     return false
    }
  }
}
