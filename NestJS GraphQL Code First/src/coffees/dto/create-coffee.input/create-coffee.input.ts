import { Field, InputType } from "@nestjs/graphql"
import { MinLength } from "class-validator"

import { CoffeeTypeEnum } from "../../../common/enums/coffee-type.enum/coffee-type.enum"
import { loggerMiddleware } from "../../../common/middleware/logger.middleware"

@InputType()
export class CreateCoffeeInput {
  @MinLength(3)
  brand: string

  @MinLength(3, { each: true })
  flavors: string[]

  @MinLength(3)
  name: string

  type: CoffeeTypeEnum
}
