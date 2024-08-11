import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CoffeeEntity } from '../coffee.entity/coffee.entity';

@Entity({ name: 'flavors' })
@ObjectType('Flavor')
export class FlavorEntity {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => CoffeeEntity, (coffee) => coffee.flavors)
  coffee: CoffeeEntity;
}
