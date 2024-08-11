import { Inject, Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigType } from "@nestjs/config"
import { JwtService } from "@nestjs/jwt"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { UserEntity } from "../../users/entities/user.entity"
import { jwtConfigNC } from "../config/jwt.config"
import { HashingService } from "../hashing/hashing.service"

import { RefreshTokenDto } from "./dto/refresh-token.dto/refresh-token.dto"
import { SignInDto } from "./dto/sign-in.dto/sign-in.dto"
import { SignUpDto } from "./dto/sign-up.dto/sign-up.dto"
import { RefreshTokenIdsStorage } from "./refresh-token-ids.storage/refresh-token-ids.storage"

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfigNC.KEY)
    private readonly jwtConfig: ConfigType<typeof jwtConfigNC>,
    private readonly refreshTokenStorage: RefreshTokenIdsStorage
  ) {}

  private async generateTokens(user: UserEntity) {
    const { refreshToken, token } = {
      refreshToken: await this.getToken(user, this.jwtConfig.refreshTokenTtl),
      token: await this.getToken(user, this.jwtConfig.accessTokenTtl),
    }
    await this.refreshTokenStorage.invalidate(user.id)
    await this.refreshTokenStorage.insert(user.id, refreshToken)
    return { refreshToken, token }
  }

  async getToken(user: UserEntity, expiresIn: number) {
    const { secret } = this.jwtConfig
    return await this.jwtService.signAsync(
      { email: user.email, sub: user.id },
      {
        expiresIn,
        secret,
      }
    )
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { sub } = await this.jwtService.verifyAsync(
      refreshTokenDto.refreshToken,
      {
        secret: this.jwtConfig.secret,
      }
    )
    const storedRefreshToken = this.refreshTokenStorage.validate(
      sub,
      refreshTokenDto.refreshToken
    )
    if (!storedRefreshToken) {
      throw new UnauthorizedException("Invalid token")
    }
    const user = await this.usersRepository.findOne({ where: { id: sub } })
    const { refreshToken, token } = await this.generateTokens(user)
    await this.refreshTokenStorage.insert(sub, refreshToken)
    return { refreshToken, token }
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
    })

    if (!user) {
      throw new UnauthorizedException("User does not exist")
    }

    const passwordsMatch = await this.hashingService.compare(
      dto.password,
      user.password
    )

    if (!passwordsMatch) {
      throw new UnauthorizedException("Invalid credentials")
    }

    return this.generateTokens(user)
  }

  async signUp(dto: SignUpDto) {
    const hashedPassword = await this.hashingService.hash(dto.password)
    const newUser = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    })
    try {
      const savedUser = await this.usersRepository.save(newUser)
      savedUser.password = undefined
      return savedUser
    } catch (e) {
      if (e.code === "23505") {
        throw new Error("Duplicate email")
      }
      throw e
    }
  }
}
