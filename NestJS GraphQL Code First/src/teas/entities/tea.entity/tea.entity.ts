import { ObjectType } from "@nestjs/graphql"
import { Column, Entity } from "typeorm"

import { DrinkInterface } from "../../../common/interfaces/drink.interface/drink.interface"

@Entity({ name: "teas" })
@ObjectType("Tea", { implements: () => DrinkInterface })
export class TeaEntity implements DrinkInterface {
  @Column()
  name: string
}
