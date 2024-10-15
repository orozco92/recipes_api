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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../../core/decorators/get-user.decorator';
import { ReqUser } from '../../core/types';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { UpdatePasswordDto } from './dtos/update-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUpload } from '../../core/models/file-upload';

@ApiBearerAuth()
@UseGuards(AuthGuard())
@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(private service: ProfileService) {}

  @Get('me')
  me(@Request() req) {
    return this.service.me(req.user.id);
  }

  @Patch('me')
  updateProfileData(@Body() body: UpdateProfileDto, @GetUser() user: ReqUser) {
    return this.service.updateProfileData(body, user.id);
  }

  @Get('favorites/ids')
  getFavoriteIds(@GetUser() user: ReqUser) {
    return this.service.getFavoriteIds(user.id);
  }

  @Get('favorites')
  favorites(@GetUser() user: ReqUser) {
    return this.service.me(user.id);
  }

  @Patch('favorites')
  @HttpCode(HttpStatus.NO_CONTENT)
  addToFavorites(@GetUser() user: ReqUser, @Body('recipeId') recipeId: number) {
    return this.service.addToFavorites(user.id, recipeId);
  }

  @Delete('favorites/:recipeId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromFavorites(
    @GetUser() user: ReqUser,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ) {
    return this.service.removeFromFavorites(user.id, recipeId);
  }

  @Patch('updatePassword')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePassword(@Body() body: UpdatePasswordDto, @GetUser() user: ReqUser) {
    return this.service.updatePassword(body, user.id);
  }

  @Patch('updatePicture')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUpload,
  })
  async updatePicture(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: ReqUser,
  ) {
    return this.service.updateProfilePicture(user.id, file.filename);
  }
}
