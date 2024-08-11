import * as process from "node:process"

import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { EventEntity } from "../events/entities/event.entity/event.entity"

import { CoffeesController } from "./coffees.controller"
import { CoffeesService } from "./coffees.service"
import { CoffeeEntity } from "./entities/coffee.entity/coffee.entity"
import { FlavorEntity } from "./entities/flavor.entity/flavor.entity"

class ConfigService {
  async getCoffeesConnections() {
    return ["water", "coca-cola"]
  }
}

class DevelopmentConfigService extends ConfigService {}

class ProductionConfigService extends ConfigService {}

@Module({
  controllers: [CoffeesController],
  exports: [CoffeesService],
  imports: [
    TypeOrmModule.forFeature([CoffeeEntity, FlavorEntity, EventEntity]),
  ],
  providers: [
    CoffeesService,
    {
      inject: [ConfigService],
      provide: "COFFEES_CONNECTIONS",
      useFactory: async (configService: ConfigService) =>
        await configService.getCoffeesConnections(),
    },
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === "production"
          ? ProductionConfigService
          : DevelopmentConfigService,
    },
  ],
})
export class CoffeesModule {}
