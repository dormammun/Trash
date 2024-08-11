import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"

import { PubSubModule } from "../pub-sub/pub-sub.module"

import { CoffeeFlavorsResolver } from "./coffee-flavors.resolver"
import { CoffeesResolver } from "./coffees.resolver"
import { CoffeesService } from "./coffees.service"
import { FlavorsByCoffeeLoader } from "./data-load/flavors-by-coffee.loader/flavors-by-coffee.loader"
import { CoffeeEntity } from "./entities/coffee.entity/coffee.entity"
import { FlavorEntity } from "./entities/flavor.entity/flavor.entity"

@Module({
  imports: [
    TypeOrmModule.forFeature([CoffeeEntity, FlavorEntity]),
    PubSubModule,
  ],
  providers: [
    CoffeesResolver,
    CoffeesService,
    CoffeeFlavorsResolver,
    FlavorsByCoffeeLoader,
  ],
})
export class CoffeesModule {}
