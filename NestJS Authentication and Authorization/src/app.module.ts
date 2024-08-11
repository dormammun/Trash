import { Module, ValidationPipe } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_GUARD, APP_PIPE } from "@nestjs/core"
import { TypeOrmModule } from "@nestjs/typeorm"

import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { CoffeesModule } from "./coffees/coffees.module"
import { AccessTokenGuard } from "./iam/authentication/guards/access-token/access-token.guard"
import { IamModule } from "./iam/iam.module"
import { UsersModule } from "./users/users.module"

@Module({
  controllers: [AppController],
  imports: [
    CoffeesModule,
    UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      autoLoadEntities: true,
      database: "data.sqlite",
      synchronize: true,
      type: "sqlite",
    }),
    IamModule,
  ],
  providers: [
    AppService,
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
  ],
})
export class AppModule {}
