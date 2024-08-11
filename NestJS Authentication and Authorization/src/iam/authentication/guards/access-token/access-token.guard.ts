import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { request, type Request } from "express"
import { Repository } from "typeorm"

import { UserEntity } from "../../../../users/entities/user.entity"
import { jwtConfigNC } from "../../../config/jwt.config"

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfigNC.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfigNC>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>
  ) {}
  private extractTokenFromToken(request: Request): string | undefined {
    const [_, token] = request.headers.cookie.split("; ")[0]?.split("=") ?? []
    return token
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const response = context.switchToHttp().getRequest<Request>()
    const token = this.extractTokenFromToken(response)
    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtConfig)
      request["activeUser"] = await this.usersRepository.findOne({
        where: { id: payload.sub },
      })
    } catch (e) {
      console.error(e)
      throw new UnauthorizedException()
    }
    return true
  }
}
