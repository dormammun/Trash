import {Body, Controller, Post, Res} from '@nestjs/common';
import {SignUpDto} from "./dto/sign-up.dto/sign-up.dto";
import {AuthenticationService} from "./authentication.service";
import {SignInDto} from "./dto/sign-in.dto/sign-in.dto";
import {type Response} from "express";
import {AuthType} from "./decorators/auth.decorator";
import {AuthTypeEnum} from "./enums/auth-type.enum";
import {RefreshTokenDto} from "./dto/refresh-token.dto/refresh-token.dto";

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {
  }

  @AuthType(AuthTypeEnum.None)
  @Post('sign-up')
  async signUp(@Body() body: SignUpDto) {
    return await this.authenticationService.signUp(body)
  }

  @AuthType(AuthTypeEnum.None)
  @Post('sign-in')
  async signIn(@Res({passthrough: true}) response: Response, @Body() body: SignInDto) {
    const {token, refreshToken} = await this.authenticationService.signIn(body)
    response.cookie('accessToken', token, {
      secure: true,
      httpOnly: true,
      sameSite: true
    })
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true
    })
    response.json({
      token, refreshToken
    })
  }

  @Post('refresh-token')
  async refreshToken(@Res({passthrough: true}) response: Response, @Body() refreshTokenDto: RefreshTokenDto) {
    const {token, refreshToken} = await this.authenticationService.refreshToken(refreshTokenDto)
    response.cookie('accessToken', token, {
      secure: true,
      httpOnly: true,
      sameSite: true
    })
    response.cookie('refreshToken', refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: true
    })
    response.json({
      token, refreshToken
    })
  }
}
