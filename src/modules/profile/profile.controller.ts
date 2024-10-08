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

@Controller('profile')
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Get('me')
  @UseGuards(AuthGuard())
  me(@Request() req) {
    return this.service.me(req.user.id);
  }

  @Get('favorites/ids')
  @UseGuards(AuthGuard())
  getFavoriteIds(@Request() req) {
    return this.service.getFavoriteIds(req.user.id);
  }

  @Get('favorites')
  @UseGuards(AuthGuard())
  favorites(@Request() req) {
    return this.service.me(req.user.id);
  }

  @Patch('favorites')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  addToFavorites(@Request() req, @Body('recipeId') recipeId: number) {
    return this.service.addToFavorites(req.user.id, recipeId);
  }

  @Delete('favorites/:recipeId')
  @UseGuards(AuthGuard())
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromFavorites(
    @Request() req,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    return this.service.removeFromFavorites(req.user.id, recipeId);
  }
}
