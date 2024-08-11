import {Module} from '@nestjs/common';
import {CoffeesController} from "./coffees.controller";
import {CoffeesService} from "./coffees.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CoffeeEntity} from "./entities/coffee.entity/coffee.entity";
import {FlavorEntity} from "./entities/flavor.entity/flavor.entity";
import {EventEntity} from "../events/entities/event.entity/event.entity";
import * as process from "node:process";

class ConfigService {
  async getCoffeesConnections() {
    return ['water', 'coca-cola']
  }
}

class DevelopmentConfigService extends ConfigService {
}

class ProductionConfigService extends ConfigService {
}

@Module({
  imports: [TypeOrmModule.forFeature([CoffeeEntity, FlavorEntity, EventEntity])],
  controllers: [CoffeesController],
  providers: [CoffeesService,
    {
      provide: 'COFFEES_CONNECTIONS',
      useFactory: async (configService: ConfigService) => await configService.getCoffeesConnections(),
      inject: [ConfigService]
    },
    {
      provide: ConfigService,
      useClass: process.env.NODE_ENV === 'production' ? ProductionConfigService : DevelopmentConfigService
    }
  ],
  exports: [CoffeesService]
})
export class CoffeesModule {
}
