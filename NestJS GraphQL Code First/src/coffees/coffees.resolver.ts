import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { CoffeeEntity } from './entities/coffee.entity/coffee.entity';
import { ParseIntPipe } from '@nestjs/common';
import { CreateCoffeeInput } from './dto/create-coffee.input/create-coffee.input';
import { CoffeesService } from './coffees.service';
import { UpdateCoffeeInput } from './dto/update-coffee.input/update-coffee.input';
import { PubSub } from 'graphql-subscriptions';
import { loggerMiddleware } from '../common/middleware/logger.middleware';

@Resolver()
export class CoffeesResolver {
  constructor(
    private readonly coffeesService: CoffeesService,
    private readonly pubSub: PubSub,
  ) {}

  @Query(() => [CoffeeEntity], { name: 'coffees' })
  async findAll(): Promise<CoffeeEntity[]> {
    return await this.coffeesService.findAll();
  }

  @Query(() => CoffeeEntity, { name: 'coffee' })
  async findOne(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
  ): Promise<CoffeeEntity> {
    return await this.coffeesService.findOne(id);
  }

  @Mutation(() => CoffeeEntity, { name: 'createCoffee' })
  async create(
    @Args('createCoffeeInput') input: CreateCoffeeInput,
  ): Promise<CoffeeEntity> {
    return await this.coffeesService.create(input);
  }

  @Mutation(() => CoffeeEntity, { name: 'updateCoffee' })
  async update(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
    @Args('updateCoffeeInput') updateCoffeeInput: UpdateCoffeeInput,
  ): Promise<CoffeeEntity> {
    return await this.coffeesService.update(id, updateCoffeeInput);
  }

  @Mutation(() => CoffeeEntity, { name: 'removeCoffee' })
  async remove(
    @Args('id', { type: () => ID }, ParseIntPipe) id: number,
  ): Promise<CoffeeEntity> {
    return await this.coffeesService.remove(id);
  }

  @Subscription(() => CoffeeEntity)
  coffeeAdded() {
    return this.pubSub.asyncIterator('coffeeAdded');
  }
}
