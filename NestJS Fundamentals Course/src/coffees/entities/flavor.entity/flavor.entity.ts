import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"

import { CoffeeEntity } from "../coffee.entity/coffee.entity"

@Entity({ name: "flavors" })
export class FlavorEntity {
  @ManyToMany((type) => CoffeeEntity, (coffee) => coffee.flavors)
  coffees: CoffeeEntity[]

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string
}
