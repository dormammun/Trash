import { Field, ID, ObjectType } from "@nestjs/graphql"
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

import { CoffeeTypeEnum } from "../../../common/enums/coffee-type.enum/coffee-type.enum"
import { DrinkInterface } from "../../../common/interfaces/drink.interface/drink.interface"
import { loggerMiddleware } from "../../../common/middleware/logger.middleware"
import { FlavorEntity } from "../flavor.entity/flavor.entity"

@Entity({ name: "coffees" })
@ObjectType("Coffee", { implements: () => DrinkInterface })
export class CoffeeEntity implements DrinkInterface {
  @Column()
  brand: string

  @CreateDateColumn({ nullable: true })
  createdAt?: Date

  @JoinTable()
  @OneToMany(() => FlavorEntity, (flavor) => flavor.coffee, {
    cascade: true,
    eager: false,
  })
  flavors: FlavorEntity[]

  @PrimaryGeneratedColumn()
  @Field(() => ID)
  id: number

  @Column()
  @Field({ middleware: [loggerMiddleware] })
  name: string

  @Column({ nullable: true })
  type?: CoffeeTypeEnum
}
