import { join } from 'path';
import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, type ApolloDriverConfig } from '@nestjs/apollo';
import { CoffeesModule } from './coffees/coffees.module';
import * as process from 'node:process';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { DateScalar } from './common/scalars/date.scalar/date.scalar';
import { TeaEntity } from './teas/entities/tea.entity/tea.entity';
import { DrinksResolver } from './drinks/drinks.resolver';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'data.sqlite',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
      buildSchemaOptions: {
        // numberScalarMode: 'integer' // when parsing make number → Int, and not Float
        // dateScalarMode: 'timestamp' when parsing → return timestamp instead date
        orphanedTypes: [TeaEntity],
      },
      subscriptions: {
        'graphql-ws': true,
      },
    }),
    CoffeesModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DateScalar,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
    DrinksResolver,
  ],
})
export class AppModule {}
