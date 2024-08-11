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
  Query, SetMetadata
} from '@nestjs/common';
import {CoffeesService} from './coffees.service';
import {CreateCoffeeDto} from "./dto/create-coffee.dto";
import {UpdateCoffeeDto} from "./dto/update-coffee.dto";
import {PaginationQueryDto} from "../common/dto/pagination-query.dto/pagination-query.dto";
import {Public} from "../common/decorators/public.decorator";

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {
  }

  @Public()
  @Get()
  async findAll(@Query() {offset, limit = 2}: PaginationQueryDto) {
    return await this.coffeesService.findAll({offset, limit});
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.coffeesService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return await this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.coffeesService.delete(id);
  }

  @Post(':id')
  async recommendCoffee(@Param('id') id: number) {
    return await this.coffeesService.recommendCoffee(id);
  }
}
