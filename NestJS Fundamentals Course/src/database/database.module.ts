import {type DynamicModule, Module} from '@nestjs/common';
import {type ConnectionOptions, createConnection} from "typeorm";

@Module({})
export class DatabaseModule {
  static register(options: ConnectionOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: 'CONNECTION',
          useValue: createConnection(options),
        }
      ]
    }
  }
}
