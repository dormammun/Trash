import {
  Injectable,
  type OnApplicationBootstrap,
  type OnApplicationShutdown,
} from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import type { Repository } from "typeorm"

import { RefreshTokenEntity } from "../entities/refresh-token.entity/refresh-token.entity"

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  constructor(
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>
  ) {}

  async insert(userId: number, token: string): Promise<any> {
    await this.refreshTokenRepository.insert({ token, userId })
  }

  async invalidate(userId: number): Promise<any> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { userId },
    })
    if (refreshToken) {
      await this.refreshTokenRepository.delete(refreshToken)
    }
  }

  onApplicationBootstrap(): any {
    // CONNECT REDIS
  }

  onApplicationShutdown(signal?: string): any {
    // DISCONNECT REDIS
  }

  async validate(userId: number, token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { token, userId },
    })
    return Boolean(refreshToken)
  }
}
