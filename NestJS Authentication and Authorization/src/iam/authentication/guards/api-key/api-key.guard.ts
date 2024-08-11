import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { type Request } from "express"
import { Repository } from "typeorm"

import { ApiKeyEntity } from "../../../../users/api-keys/entities/api-key.entity/api-key.entity"
import { ApiKeysService } from "../../api-keys.service"

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeysService,
    @InjectRepository(ApiKeyEntity)
    private readonly apiKeysRepository: Repository<ApiKeyEntity>
  ) {}

  private extractKeyFromHeader(request: Request): string | undefined {
    // type: ApiKey or Bearer
    const [type, key] = request.headers.authorization?.split(" ") ?? []
    return type === "ApiKey" ? key : undefined
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const apiKey = this.extractKeyFromHeader(request)
    if (!apiKey) {
      throw new UnauthorizedException()
    }
    const apiKeyEntityId = this.apiKeyService.extractIdFromApiKey(apiKey)
    try {
      const apiKeyEntity = await this.apiKeysRepository.findOne({
        relations: { user: true },
        where: { uuid: apiKeyEntityId },
      })
      await this.apiKeyService.validate(apiKey, apiKeyEntity.key)
      request["activeUser"] = {
        email: apiKeyEntity.user.email,
        permissions: apiKeyEntity.user.permissions,
        role: apiKeyEntity.user.role,
        sub: apiKeyEntity.user.id,
      }
    } catch (e) {
      throw new UnauthorizedException()
    }
    return true
  }
}
