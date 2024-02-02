import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ListResponseDto } from '../../core/models/list-response';
import { ListUserDto } from './dto/list-user.dto';
import { ApiListResponse } from '../../core/decorators/api-paginated-response.decorator';
import { UserDto } from './dto/user.dto';
import { PagedAndSortedRequest } from '../../core/models/list-request';

@Controller('users')
@ApiTags('users')
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

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<UserDto> {
    return this.userService.remove(+id);
  }
}
