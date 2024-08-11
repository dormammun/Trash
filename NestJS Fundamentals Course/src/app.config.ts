import {type ConfigType, registerAs} from "@nestjs/config";

export type AppConfig = ConfigType<typeof appConfig>

export const appConfig = registerAs('app', () => ({
  database: 'data.sqlite',
  apiKey: 'key'
}))
