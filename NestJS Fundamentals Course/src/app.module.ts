import { Module } from "@nestjs/common"
import { ConfigModule, type ConfigType } from "@nestjs/config"
import { APP_GUARD } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"

import { type AppConfig, appConfig } from "./app.config"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CoffeeRatingModule } from "./coffee-rating/coffee-rating.module"
import { CoffeesModule } from "./coffees/coffees.module"
import { ApiKeyGuard } from "./common/guards/api-key/api-key.guard"
import { DatabaseModule } from "./database/database.module"

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot(), ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: (appConfig: AppConfig) => ({
        autoLoadEntities: true,
        database: appConfig.database,
        synchronize: true,
        type: "sqlite",
      }),
    }),
    CoffeesModule,
    CoffeeRatingModule,
    DatabaseModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
