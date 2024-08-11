import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { type Request } from "express"
import { Observable } from "rxjs"

import { type AppConfig, appConfig } from "../../../app.config"
import { IS_PUBLIC_KEY } from "../../decorators/public.decorator"

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(appConfig.KEY) private readonly config: AppConfig
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Observable<boolean> | Promise<boolean> {
    const handler = context.getHandler()
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, handler)
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest<Request>()
    return request.headers["api-key"] === this.config.apiKey
  }
}
