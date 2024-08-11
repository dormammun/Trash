import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm"

import { FlavorEntity } from "../flavor.entity/flavor.entity"

@Entity({ name: "coffees" })
export class CoffeeEntity {
  @Column()
  brand: string

  @JoinTable()
  @ManyToMany((type) => FlavorEntity, (flavor) => flavor.coffees, {
    cascade: true,
  })
  flavors: FlavorEntity[]

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ default: 0 })
  recommendations: number
}
