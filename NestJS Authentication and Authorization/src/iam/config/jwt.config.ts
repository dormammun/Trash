import {registerAs} from "@nestjs/config";

export const jwtConfigNC = registerAs('jwt', () => ({
  secret: 'secret',
  accessTokenTtl: 3600,
  refreshTokenTtl: 86400,
}))