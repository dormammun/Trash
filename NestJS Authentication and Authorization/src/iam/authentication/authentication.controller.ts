import { Body, Controller, Post, Res } from "@nestjs/common"
import { type Response } from "express"

import { AuthenticationService } from "./authentication.service"
import { AuthType } from "./decorators/auth.decorator"
import { RefreshTokenDto } from "./dto/refresh-token.dto/refresh-token.dto"
import { SignInDto } from "./dto/sign-in.dto/sign-in.dto"
import { SignUpDto } from "./dto/sign-up.dto/sign-up.dto"
import { AuthTypeEnum } from "./enums/auth-type.enum"

@Controller("authentication")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post("refresh-token")
  async refreshToken(
    @Res({ passthrough: true }) response: Response,
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    const { refreshToken, token } =
      await this.authenticationService.refreshToken(refreshTokenDto)
    response.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: true,
      secure: true,
    })
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
    })
    response.json({
      refreshToken,
      token,
    })
  }

  @AuthType(AuthTypeEnum.None)
  @Post("sign-in")
  async signIn(
    @Res({ passthrough: true }) response: Response,
    @Body() body: SignInDto
  ) {
    const { refreshToken, token } =
      await this.authenticationService.signIn(body)
    response.cookie("accessToken", token, {
      httpOnly: true,
      sameSite: true,
      secure: true,
    })
    response.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: true,
      secure: true,
    })
    response.json({
      refreshToken,
      token,
    })
  }

  @AuthType(AuthTypeEnum.None)
  @Post("sign-up")
  async signUp(@Body() body: SignUpDto) {
    return await this.authenticationService.signUp(body)
  }
}
