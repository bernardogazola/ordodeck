import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { Public } from '@/common/decorators/public.decorator';
import { SignInUserDto } from './dto/signIn-user.dto';
import { SignOutUserDto } from './dto/signOut-user.dto';
import { SignOutAllDeviceUserDto } from './dto/signOutAllDevice-user.dto';
import { JwtRefreshGuard } from '@/common/guards/jwt-refresh.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('sign-up')
  async register(@Body() createUserDto: CreateUserDto) {
    await this.authService.register(createUserDto);
    return {
      message: 'User registered successfully',
    };
  }

  @Public()
  @Post('sign-in')
  async signIn(@Body() signInUserDto: SignInUserDto) {
    const data = await this.authService.signIn(signInUserDto);
    const { id, name, username, email, createdAt, updatedAt } = data.data;
    return {
      message: 'User signed in successfully',
      data: {
        id,
        name,
        username,
        email,
        createdAt,
        updatedAt,
      },
      tokens: data.tokens,
    };
  }

  @Post('sign-out')
  async signOut(@Body() signOutUserDto: SignOutUserDto) {
    await this.authService.signOut(signOutUserDto);
    return { message: 'User signed out successfully' };
  }

  @Post('sign-out-allDevices')
  async signOutAllDevices(
    @Body() signOutAllDeviceDto: SignOutAllDeviceUserDto,
  ) {
    await this.authService.signOutAllDevices(signOutAllDeviceDto);
    return { message: 'User signed out from all devices successfully' };
  }

  @UseGuards(JwtRefreshGuard)
  @Patch('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.authService.refreshToken(refreshTokenDto);
    return {
      message: 'Refresh token generated successfully',
      access_token: data.access_token,
      refresh_token: data.refresh_token,
    };
  }

  @Patch('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    await this.authService.changePassword(changePasswordDto);
    return { message: 'Password changed successfully' };
  }
}
