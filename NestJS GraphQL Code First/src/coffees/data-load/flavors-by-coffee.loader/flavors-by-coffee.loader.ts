import { Injectable, Scope } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import DataLoader from "dataloader"
import { Repository } from "typeorm"

import { CoffeeEntity } from "../../entities/coffee.entity/coffee.entity"
import { FlavorEntity } from "../../entities/flavor.entity/flavor.entity"

@Injectable({ scope: Scope.REQUEST })
export class FlavorsByCoffeeLoader extends DataLoader<number, FlavorEntity[]> {
  constructor(
    @InjectRepository(CoffeeEntity)
    private readonly coffeesRepo: Repository<CoffeeEntity>
  ) {
    super((keys) => this.batchLoadFn(keys))
  }

  private batchLoadFn(keys: ReadonlyArray<number>): Promise<FlavorEntity[][]> {
    return Promise.all(
      keys.map(async (key) => {
        const coffee = await this.coffeesRepo.findOne({
          relations: ["flavors"],
          where: { id: key },
        })
        return coffee ? coffee.flavors : []
      })
    )
  }
}
