import {Connection, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {HttpException, HttpStatus, Inject, Injectable} from '@nestjs/common';
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {CoffeeEntity} from "./entities/coffee.entity/coffee.entity";
import {FlavorEntity} from "./entities/flavor.entity/flavor.entity";
import type {PaginationQueryDto} from "../common/dto/pagination-query.dto/pagination-query.dto";
import {EventEntity} from "../events/entities/event.entity/event.entity";

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(CoffeeEntity) private readonly coffeeRepository: Repository<CoffeeEntity>,
    @InjectRepository(FlavorEntity) private readonly flavorRepository: Repository<FlavorEntity>,
    private readonly connection: Connection,
    @Inject('COFFEES_CONNECTIONS') private readonly coffeeConnections: string[]
  ) {
    console.log(this.coffeeConnections)
  }

  async findAll({offset, limit}: Required<PaginationQueryDto>): Promise<CoffeeEntity[]> {
    return await this.coffeeRepository.find({
      skip: offset,
      take: limit,
      relations: ['flavors']
    });
  }

  async findOne(id: number): Promise<CoffeeEntity> {
    const coffee = await this.coffeeRepository.findOne({where: {id}, relations: ['flavors']});
    if (!coffee) {
      throw new HttpException(`Coffee with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    return coffee;
  }

  async create(coffee: CreateCoffeeDto): Promise<CoffeeEntity> {
    const newCoffee = this.coffeeRepository.create({
      ...coffee,
      flavors: await Promise.all(coffee.flavors.map(name => this.preloadFlavorByName(name))),
    });
    await this.coffeeRepository.save(newCoffee);
    return newCoffee;
  }

  async update(id: number, updatedCoffee: UpdateCoffeeDto): Promise<CoffeeEntity> {
    let existingCoffee = await this.coffeeRepository.preload({
      id,
      ...updatedCoffee,
      flavors: updatedCoffee.flavors ?
        await Promise.all(updatedCoffee.flavors.map(name => this.preloadFlavorByName(name))) :
        undefined,
    });
    if (!existingCoffee) {
      throw new HttpException(`Coffee with id ${id} not found`, HttpStatus.NOT_FOUND);
    }
    await this.coffeeRepository.save(existingCoffee);
    return await this.findOne(id)
  }

  async delete(id: number): Promise<CoffeeEntity> {
    const coffee = await this.findOne(id);
    return await this.coffeeRepository.remove(coffee);
  }


  async recommendCoffee(id: number): Promise<CoffeeEntity> {
    const coffee = await this.findOne(id)
    const qr = this.connection.createQueryRunner()

    await qr.connect()
    await qr.startTransaction()
    try {
      coffee.recommendations++
      const recommendationEvent = new EventEntity()
      recommendationEvent.name = 'recommend_coffee'
      recommendationEvent.type = 'coffee'
      recommendationEvent.payload = {coffeeId: coffee.id}

      await qr.manager.save(coffee)
      await qr.manager.save(recommendationEvent)
      await qr.commitTransaction()
    } catch {
      await qr.rollbackTransaction()
    } finally {
      await qr.release()
    }

    return coffee
  }

  private async preloadFlavorByName(name: string): Promise<FlavorEntity> {
    let flavor = await this.flavorRepository.findOne({where: {name}});
    if (!flavor) {
      return this.flavorRepository.create({name});
    }

    return flavor;
  }
}
