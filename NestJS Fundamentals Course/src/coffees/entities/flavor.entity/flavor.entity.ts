import {Column, Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {CoffeeEntity} from "../coffee.entity/coffee.entity";

@Entity({name: 'flavors'})
export class FlavorEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(type => CoffeeEntity, coffee => coffee.flavors)
  coffees: CoffeeEntity[]
}
