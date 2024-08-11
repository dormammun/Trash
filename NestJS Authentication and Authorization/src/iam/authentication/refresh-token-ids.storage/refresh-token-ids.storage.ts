import {Injectable, type OnApplicationBootstrap, type OnApplicationShutdown} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {RefreshTokenEntity} from "../entities/refresh-token.entity/refresh-token.entity";
import type {Repository} from "typeorm";

@Injectable()
export class RefreshTokenIdsStorage implements OnApplicationBootstrap, OnApplicationShutdown {
  constructor(
    @InjectRepository(RefreshTokenEntity) private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {
  }

  onApplicationBootstrap(): any {
    // CONNECT REDIS
  }

  onApplicationShutdown(signal?: string): any {
    // DISCONNECT REDIS
  }

  async insert(userId: number, token: string): Promise<any> {
    await this.refreshTokenRepository.insert({userId, token});
  }

  async validate(userId: number, token: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findOne({where: { userId, token }});
    return Boolean(refreshToken);
  }

  async invalidate(userId: number): Promise<any> {
    const refreshToken = await this.refreshTokenRepository.findOne({where: { userId }});
    if (refreshToken) {
      await this.refreshTokenRepository.delete(refreshToken);
    }
  }
}
