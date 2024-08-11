import { createUnionType } from "@nestjs/graphql"

import { CoffeeEntity } from "../../coffees/entities/coffee.entity/coffee.entity"
import { TeaEntity } from "../../teas/entities/tea.entity/tea.entity"

export const DrinksResultUnion = createUnionType({
  // @info: union similar to interfaces, but without shared fields
  name: "DrinksResultUnion",
  types: () => [CoffeeEntity, TeaEntity],
})
