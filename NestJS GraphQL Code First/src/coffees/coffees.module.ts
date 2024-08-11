import { Module } from '@nestjs/common';
import { CoffeesResolver } from './coffees.resolver';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeeEntity } from './entities/coffee.entity/coffee.entity';
import { FlavorEntity } from './entities/flavor.entity/flavor.entity';
import { CoffeeFlavorsResolver } from './coffee-flavors.resolver';
import { PubSubModule } from '../pub-sub/pub-sub.module';
import { FlavorsByCoffeeLoader } from './data-load/flavors-by-coffee.loader/flavors-by-coffee.loader';

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
