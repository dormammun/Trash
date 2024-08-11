import { registerEnumType } from "@nestjs/graphql"

export enum CoffeeTypeEnum {
  ARABICA = "Arabica",
  ROBUSTA = "Robusta",
}

registerEnumType(CoffeeTypeEnum, {
  name: "CoffeeType",
})
