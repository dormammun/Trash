import * as process from "node:process"
import { join } from "path"

import { ApolloDriver, type ApolloDriverConfig } from "@nestjs/apollo"
import { Module, ValidationPipe } from "@nestjs/common"
import { APP_PIPE } from "@nestjs/core"
import { GraphQLModule } from "@nestjs/graphql"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CoffeesModule } from "./coffees/coffees.module"
import { DateScalar } from "./common/scalars/date.scalar/date.scalar"
import { DrinksResolver } from "./drinks/drinks.resolver"
import { PubSubModule } from "./pub-sub/pub-sub.module"
import { TeaEntity } from "./teas/entities/tea.entity/tea.entity"

@Module({
  controllers: [AppController],
  imports: [
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: "data.sqlite",
      logging: true,
      synchronize: true,
      type: "sqlite",
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: join(process.cwd(), "src/schema.graphql"),
      buildSchemaOptions: {
        // numberScalarMode: 'integer' // when parsing make number → Int, and not Float
        // dateScalarMode: 'timestamp' when parsing → return timestamp instead date
        orphanedTypes: [TeaEntity],
      },
      driver: ApolloDriver,
      subscriptions: {
        "graphql-ws": true,
      },
    }),
    CoffeesModule,
    PubSubModule,
  ],
  providers: [
    AppService,
    DateScalar,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        forbidUnknownValues: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        whitelist: true,
      }),
    },
    DrinksResolver,
  ],
})
export class AppModule {}
