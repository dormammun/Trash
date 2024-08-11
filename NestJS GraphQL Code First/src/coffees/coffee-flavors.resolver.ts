import { Parent, ResolveField, Resolver } from "@nestjs/graphql"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"

import { CoffeeEntity } from "./entities/coffee.entity/coffee.entity"
import { FlavorEntity } from "./entities/flavor.entity/flavor.entity"

@Resolver(() => CoffeeEntity)
export class CoffeeFlavorsResolver {
  constructor(
    @InjectRepository(FlavorEntity)
    private readonly flavorsRepo: Repository<FlavorEntity>
  ) {}

  @ResolveField("flavors", () => [FlavorEntity])
  async finCoffeeFlavors(
    @Parent() coffeeEntity: CoffeeEntity
  ): Promise<FlavorEntity[]> {
    return await this.flavorsRepo
      .createQueryBuilder("flavors")
      .innerJoin("flavors.coffee", "coffees", "coffees.id = :coffeeId", {
        coffeeId: coffeeEntity.id,
      })
      .getMany()
  }
}
