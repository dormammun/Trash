import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { CoffeeEntity } from './entities/coffee.entity/coffee.entity';
import { ParseIntPipe } from '@nestjs/common';
import { CreateCoffeeInput } from "./dto/create-coffee.input/create-coffee.input";

@Resolver()
export class CoffeesResolver {
  @Query(() => [CoffeeEntity], { name: 'coffees' })
  async findCoffees(): Promise<CoffeeEntity[]> {
    return [];
  }

  @Query(() => CoffeeEntity, { name: 'coffee', nullable: true })
  async findOne(
    @Args('id', { type: () => ID}, ParseIntPipe) id: number,
  ): Promise<CoffeeEntity> {
    return null;
  }

  @Mutation(() => CoffeeEntity, { name: 'createCoffee', nullable: true })
  create(@Args('createCoffeeInput') input: CreateCoffeeInput): Promise<CoffeeEntity> {
    return null
  }
}
