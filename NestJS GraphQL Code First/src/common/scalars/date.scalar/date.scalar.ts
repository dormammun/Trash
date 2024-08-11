import { CustomScalar, Scalar } from "@nestjs/graphql"
import { Kind, ValueNode } from "graphql/language"

@Scalar("Date", () => Date)
export class DateScalar implements CustomScalar<number, Date> {
  parseLiteral(ast: ValueNode): Date {
    if (ast.kind === Kind.INT) {
      return new Date(ast.value)
    }
    return null
  }

  parseValue(value: string): Date {
    return new Date(value)
  }

  serialize(value: Date): number {
    return value.getTime()
  }
}
