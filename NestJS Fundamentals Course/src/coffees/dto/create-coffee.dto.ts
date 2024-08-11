import { IsString } from "class-validator"

export class CreateCoffeeDto {
  @IsString()
  readonly brand: string

  @IsString({ each: true })
  readonly flavors: string[]

  @IsString()
  readonly name: string
}
