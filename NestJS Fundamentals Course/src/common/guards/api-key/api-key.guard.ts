import {type Request} from "express";

import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {Reflector} from "@nestjs/core";
import {IS_PUBLIC_KEY} from "../../decorators/public.decorator";
import {type AppConfig, appConfig} from "../../../app.config";

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector,
              @Inject(appConfig.KEY) private readonly config: AppConfig,
  ) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler()
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, handler)
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    return request.headers['api-key'] === this.config.apiKey;
  }
}
