import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { RolesGuard } from 'src/common/roles.guard';
import { Roles } from 'src/common/roles.decroator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password,body.role);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req) {
    return this.authService.getProfile(req.user.sub);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard) 
  @Roles('admin') 
  @Get('all-users')
  getAllUsers(@Req() req) {
    return this.authService.getAllUsers();
  }

}
