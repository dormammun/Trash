import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CoffeesModule} from './coffees/coffees.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import {ConfigModule, type ConfigType} from "@nestjs/config";
import {type AppConfig, appConfig} from "./app.config";
import {APP_GUARD} from "@nestjs/core";
import {ApiKeyGuard} from "./common/guards/api-key/api-key.guard";

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot(), ConfigModule.forFeature(appConfig)],
      useFactory: (appConfig: AppConfig) => ({
        type: 'sqlite',
        database: appConfig.database,
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [appConfig.KEY]
    }),
    CoffeesModule,
    CoffeeRatingModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ApiKeyGuard
  }]
})
export class AppModule {
}
