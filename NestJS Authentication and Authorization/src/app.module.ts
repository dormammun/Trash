import {Module, ValidationPipe} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { UsersModule } from './users/users.module';
import {TypeOrmModule} from "@nestjs/typeorm";
import { IamModule } from './iam/iam.module';
import {APP_GUARD, APP_PIPE} from "@nestjs/core";
import {ConfigModule} from "@nestjs/config";
import {AccessTokenGuard} from "./iam/authentication/guards/access-token/access-token.guard";


@Module({
  imports: [CoffeesModule, UsersModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      autoLoadEntities: true,
      synchronize: true
    }),
    IamModule
  ],
  controllers: [AppController],
  providers: [AppService, {provide: APP_PIPE, useValue: new ValidationPipe({
      transformOptions: {
        enableImplicitConversion: true,
      },
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
    })},
  ],
})
export class AppModule {}
