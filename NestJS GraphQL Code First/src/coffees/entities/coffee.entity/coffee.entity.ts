import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FlavorEntity } from '../flavor.entity/flavor.entity';
import { DrinkInterface } from '../../../common/interfaces/drink.interface/drink.interface';
import { CoffeeTypeEnum } from '../../../common/enums/coffee-type.enum/coffee-type.enum';
import { loggerMiddleware } from '../../../common/middleware/logger.middleware';

@Entity({ name: 'coffees' })
@ObjectType('Coffee', { implements: () => DrinkInterface })
export class CoffeeEntity implements DrinkInterface {
  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number;

  @Column()
  @Field({ middleware: [loggerMiddleware] })
  name: string;

  @Column()
  brand: string;

  @JoinTable()
  @OneToMany(() => FlavorEntity, (flavor) => flavor.coffee, {
    cascade: true,
    eager: false,
  })
  flavors: FlavorEntity[];

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @Column({ nullable: true })
  type?: CoffeeTypeEnum;
}
