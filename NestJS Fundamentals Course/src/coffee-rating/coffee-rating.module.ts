import {Module} from '@nestjs/common';
import {CoffeesModule} from "../coffees/coffees.module";
import {CoffeeRatingService} from './coffee-rating.service';
import {DatabaseModule} from "../database/database.module";

@Module({
  imports: [CoffeesModule, DatabaseModule.register({
    type: 'sqlite',
    database: 'data.sqlite',
    synchronize: true,
  })],
  providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {
}
