import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { FlavorEntity } from '../../entities/flavor.entity/flavor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoffeeEntity } from '../../entities/coffee.entity/coffee.entity';

@Injectable({ scope: Scope.REQUEST })
export class FlavorsByCoffeeLoader extends DataLoader<number, FlavorEntity[]> {
  constructor(
    @InjectRepository(CoffeeEntity)
    private readonly coffeesRepo: Repository<CoffeeEntity>,
  ) {
    super(keys => this.batchLoadFn(keys))
  }

  private batchLoadFn(keys: ReadonlyArray<number>): Promise<FlavorEntity[][]> {
    return Promise.all(
      keys.map(async key => {
        const coffee = await this.coffeesRepo.findOne({ where: { id: key }, relations: ["flavors"] });
        return coffee ? coffee.flavors : [];
      })
    );
  }
}
