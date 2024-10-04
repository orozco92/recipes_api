import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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
}
