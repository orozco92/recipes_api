import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { RecipeService } from './recipe.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ListRecipeDto } from './dto/list-recipe.dto';
import { ApiListResponse } from '../../core/decorators/api-paginated-response.decorator';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { ReqUser } from '../../core/types';
import { Roles } from '../../core/enums';
import { Role } from '../../core/decorators/role.decorator';
import { RoleGuard } from '../auth/services/role.guard';
import { Throttle } from '@nestjs/throttler';
import { ThrottleConfig } from '../../config/throttle.config';
import { ListRecipeRequest } from './dto/list-recipe-request';

@Controller('recipes')
@ApiTags('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Get()
  @ApiListResponse(ListRecipeDto)
  findAll(@Query() query: ListRecipeRequest) {
    return this.recipeService.findAll(query);
  }

  @Get('/favorites')
  @ApiListResponse(ListRecipeDto)
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  getFavorites(@Query() query: ListRecipeRequest, @GetUser() user: ReqUser) {
    return this.recipeService.getFavorites(query, user.id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recipeService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role(Roles.Colaborator)
  @Throttle({ default: ThrottleConfig.short })
  create(@Body() createRecipeDto: CreateRecipeDto, @GetUser() user: ReqUser) {
    return this.recipeService.create(createRecipeDto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role(Roles.Colaborator)
  @Throttle({ default: ThrottleConfig.short })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @GetUser() user: ReqUser,
  ) {
    return this.recipeService.update(id, updateRecipeDto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @Role(Roles.Colaborator)
  @Throttle({ default: ThrottleConfig.short })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: ReqUser) {
    return this.recipeService.remove(id, user);
  }
}
