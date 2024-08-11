import { registerAs } from "@nestjs/config"

export const jwtConfigNC = registerAs("jwt", () => ({
  accessTokenTtl: 3600,
  refreshTokenTtl: 86400,
  secret: "secret",
}))
