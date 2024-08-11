import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {ApiKeysService} from "../../api-keys.service";
import {type Request} from "express";
import {Repository} from "typeorm";
import {ApiKeyEntity} from "../../../../users/api-keys/entities/api-key.entity/api-key.entity";
import {InjectRepository} from "@nestjs/typeorm";


@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeysService,
              @InjectRepository(ApiKeyEntity)
              private readonly apiKeysRepository: Repository<ApiKeyEntity>
  ) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>()
    const apiKey = this.extractKeyFromHeader(request)
    if (!apiKey) {
      throw new UnauthorizedException()
    }
    const apiKeyEntityId = this.apiKeyService.extractIdFromApiKey(apiKey)
    try {
      const apiKeyEntity = await this.apiKeysRepository
        .findOne({where: {uuid: apiKeyEntityId}, relations: {user: true}})
      await this.apiKeyService.validate(apiKey, apiKeyEntity.key)
      request['activeUser'] = {
        sub: apiKeyEntity.user.id,
        email: apiKeyEntity.user.email,
        role: apiKeyEntity.user.role,
        permissions: apiKeyEntity.user.permissions
      }
    } catch (e) {
      throw new UnauthorizedException()
    }
    return true;
  }

  private extractKeyFromHeader(request: Request): string | undefined {
    // type: ApiKey or Bearer
    const [type, key] = request.headers.authorization?.split(' ') ?? []
    return type === 'ApiKey' ? key : undefined
  }
}
