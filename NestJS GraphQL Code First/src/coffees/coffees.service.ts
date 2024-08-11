import { UserInputError } from "@nestjs/apollo"
import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { PubSub } from "graphql-subscriptions"
import { Repository } from "typeorm"

import { CreateCoffeeInput } from "./dto/create-coffee.input/create-coffee.input"
import { UpdateCoffeeInput } from "./dto/update-coffee.input/update-coffee.input"
import { CoffeeEntity } from "./entities/coffee.entity/coffee.entity"
import { FlavorEntity } from "./entities/flavor.entity/flavor.entity"

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(CoffeeEntity)
    private readonly coffeesRep: Repository<CoffeeEntity>,
    @InjectRepository(FlavorEntity)
    private readonly flavorsRep: Repository<FlavorEntity>,
    private readonly pubSub: PubSub
  ) {}

  async create(createCoffeeDto: CreateCoffeeInput) {
    const record = await this.coffeesRep.save(
      this.coffeesRep.create({
        ...createCoffeeDto,
        flavors: await Promise.all(
          createCoffeeDto.flavors.map((flavor) =>
            this.preloadFlavorByName(flavor)
          )
        ),
      })
    )
    await this.pubSub.publish("coffeeAdded", { coffeeCreated: record })
    return record
  }

  async findAll() {
    return await this.coffeesRep.find()
  }

  async findOne(id: number) {
    const record = await this.coffeesRep.findOne({ where: { id } })
    if (!record) {
      throw new UserInputError(`Coffee found with id ${id} not found`)
    }
    return record
  }

  async preloadFlavorByName(name: string): Promise<FlavorEntity> {
    const existingFlavor = await this.flavorsRep.findOne({ where: { name } })
    if (existingFlavor) {
      return existingFlavor
    }
    return this.flavorsRep.create({ name })
  }

  async remove(id: number) {
    const record = await this.coffeesRep.findOne({ where: { id } })
    if (!record) {
      throw new UserInputError(
        `Cannot remove: Coffee with id ${id} does not exist.`
      )
    }
    // @todo: remove removes "id", but type shows that it is regular entity
    return { id, ...(await this.coffeesRep.remove(record)) }
  }

  async update(id: number, updateCoffeeInput: UpdateCoffeeInput) {
    const record = await this.coffeesRep.preload({
      id,
      ...updateCoffeeInput,
      flavors: await Promise.all(
        updateCoffeeInput.flavors.map((flavor) =>
          this.preloadFlavorByName(flavor)
        )
      ),
    })
    if (!record) {
      throw new UserInputError(
        `Cannot update: Coffee with id ${id} does not exist.`
      )
    }
    return await this.coffeesRep.save(record)
  }
}
