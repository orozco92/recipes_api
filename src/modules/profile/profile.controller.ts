import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { ReqUser } from '../../core/types';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';

@Controller('profile')
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  me(@Request() req) {
    return this.service.me(req.user.id);
  }

  @Patch('me')
  @UseGuards(AuthGuard())
  updateProfileData(@Body() body: UpdateProfileDto, @GetUser() user: ReqUser) {
    return this.service.updateProfileData(body, user.id);
  }

  @Get('favorites/ids')
  @UseGuards(AuthGuard())
  getFavoriteIds(@GetUser() user: ReqUser) {
    return this.service.getFavoriteIds(user.id);
  }

  @Get('favorites')
  @UseGuards(AuthGuard())
  favorites(@GetUser() user: ReqUser) {
    return this.service.me(user.id);
  }

  @Patch('favorites')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  addToFavorites(@GetUser() user: ReqUser, @Body('recipeId') recipeId: number) {
    return this.service.addToFavorites(user.id, recipeId);
  }

  @Delete('favorites/:recipeId')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromFavorites(
    @GetUser() user: ReqUser,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    return this.service.removeFromFavorites(user.id, recipeId);
  }

  @Patch('resetPassword')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  resetPassword(@Body() body: UpdatePasswordDto, @GetUser() user: ReqUser) {
    return this.service.resetPassword(body, user.id);
  }
}
