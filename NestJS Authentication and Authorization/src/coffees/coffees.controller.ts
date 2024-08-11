import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {CoffeesService} from './coffees.service';
import {CreateCoffeeDto} from './dto/create-coffee.dto';
import {UpdateCoffeeDto} from './dto/update-coffee.dto';
import {AuthTypeEnum} from "../iam/authentication/enums/auth-type.enum";
import {AuthType} from "../iam/authentication/decorators/auth.decorator";
import {Roles} from "../iam/authorization/decorators/roles";
import {RoleEnum} from "../users/enums/role.enum";
import {Permissions} from "../iam/authentication/decorators/permissions.decorator";
import {CoffeesPermissionsEnum} from "./coffees.permissions";
import {Policies} from "../iam/authentication/policies/policies.decorator";
import {FrameworkContributerPolicy} from "../iam/authentication/policies/framework-contributer.policy";

@AuthType(AuthTypeEnum.Bearer, AuthTypeEnum.ApiKey)
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Roles(RoleEnum.Admin)
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @AuthType(AuthTypeEnum.None)
  @Get()
  findAll() {
    return this.coffeesService.findAll();
  }

  @AuthType(AuthTypeEnum.None)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeesService.findOne(+id);
  }

  @Permissions(CoffeesPermissionsEnum.UpdateCoffee)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(+id, updateCoffeeDto);
  }

  @Policies(new FrameworkContributerPolicy())
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeesService.remove(+id);
  }
}
