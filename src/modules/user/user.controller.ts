import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ListResponseDto } from '../../core/models/list-response';
import { ListUserDto } from './dto/list-user.dto';
import { ApiListResponse } from '../../core/decorators/api-paginated-response.decorator';
import { UserDto } from './dto/user.dto';
import { PagedAndSortedRequest } from '../../core/models/list-request';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '../../core/decorators/role.decorator';
import { Roles } from '../../core/enums';
import { RoleGuard } from '../auth/services/role.guard';
import { Throttle } from '@nestjs/throttler';
import { ThrottleConfig } from '../../config/throttle.config';

@Controller('users')
@ApiTags('users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Role(Roles.Admin)
@ApiExtraModels(PagedAndSortedRequest)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiListResponse(ListUserDto)
  async findAll(
    @Query() query: PagedAndSortedRequest,
  ): Promise<ListResponseDto<ListUserDto>> {
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Throttle({ default: ThrottleConfig.short })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Throttle({ default: ThrottleConfig.short })
  remove(@Param('id', ParseIntPipe) id: number): Promise<UserDto> {
    return this.userService.remove(id);
  }
}
