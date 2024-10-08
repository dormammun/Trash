import { ValidationPipe } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"

import { AppModule } from "./app.module"
import { HttpExceptionFilter } from "./common/filters/http-exception/http-exception.filter"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      whitelist: true,
    })
  )
  app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(3000)
}

bootstrap()
