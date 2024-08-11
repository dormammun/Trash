import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  SetMetadata,
} from "@nestjs/common"

import { Public } from "../common/decorators/public.decorator"
import { PaginationQueryDto } from "../common/dto/pagination-query.dto/pagination-query.dto"

import { CoffeesService } from "./coffees.service"
import { CreateCoffeeDto } from "./dto/create-coffee.dto"
import { UpdateCoffeeDto } from "./dto/update-coffee.dto"

@Controller("coffees")
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return await this.coffeesService.create(createCoffeeDto)
  }

  @Public()
  @Get()
  async findAll(@Query() { limit = 2, offset }: PaginationQueryDto) {
    return await this.coffeesService.findAll({ limit, offset })
  }

  @Get(":id")
  async findOne(@Param("id") id: number) {
    return await this.coffeesService.findOne(id)
  }

  @Post(":id")
  async recommendCoffee(@Param("id") id: number) {
    return await this.coffeesService.recommendCoffee(id)
  }

  @Delete(":id")
  async remove(@Param("id") id: number) {
    return await this.coffeesService.delete(id)
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto)
  }
}
