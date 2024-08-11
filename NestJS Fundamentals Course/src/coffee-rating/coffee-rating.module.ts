import { Module } from "@nestjs/common"

import { CoffeesModule } from "../coffees/coffees.module"
import { DatabaseModule } from "../database/database.module"

import { CoffeeRatingService } from "./coffee-rating.service"

@Module({
  imports: [
    CoffeesModule,
    DatabaseModule.register({
      database: "data.sqlite",
      synchronize: true,
      type: "sqlite",
    }),
  ],
  providers: [CoffeeRatingService],
})
export class CoffeeRatingModule {}
