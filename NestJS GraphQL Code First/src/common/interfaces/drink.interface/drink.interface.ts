import { Field, InterfaceType } from "@nestjs/graphql"

@InterfaceType()
export abstract class DrinkInterface {
  @Field() // abstracts don't track by gql
  name: string
}
