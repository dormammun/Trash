import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { CoffeeEntity } from './entities/coffee.entity/coffee.entity';
import { FlavorEntity } from './entities/flavor.entity/flavor.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Resolver(() => CoffeeEntity)
export class CoffeeFlavorsResolver {
  constructor(
    @InjectRepository(FlavorEntity)
    private readonly flavorsRepo: Repository<FlavorEntity>,
  ) {}

  @ResolveField('flavors', () => [FlavorEntity])
  async finCoffeeFlavors(
    @Parent() coffeeEntity: CoffeeEntity,
  ): Promise<FlavorEntity[]> {
    return await this.flavorsRepo
      .createQueryBuilder('flavors')
      .innerJoin('flavors.coffee', 'coffees', 'coffees.id = :coffeeId', {
        coffeeId: coffeeEntity.id,
      })
      .getMany();
  }
}
