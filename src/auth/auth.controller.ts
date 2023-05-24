import { Controller, Get, HttpCode, Post, Redirect, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetOAuthUser } from 'src/auth/decorators/getOAuthUser.decorator';
import { OAuthUser } from 'src/auth/interfaces/OAuthUser.interface';
import { AppConfig } from 'src/utils/app.config';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/currentUser.decorator';
import { Public } from './decorators/public.decorator';
import { RefreshGuard } from './guards/refresh.guard';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}
  //#region OAuth
  @Get('authsch')
  @Public()
  @UseGuards(AuthGuard('authsch'))
  loginSch(): void {
    //never called
  }
  @Get('authsch/callback')
  @Public()
  @UseGuards(AuthGuard('authsch'))
  @Redirect()
  async loginSchCallback(@GetOAuthUser() user: OAuthUser): Promise<{ url: string }> {
    const newUser = await this.authService.findOrCreateUser(user);
    const jwt = await this.authService.generateToken(newUser);
    return {
      url: `${this.configService.get<string>('frontend.auth_url')}?jwt=${jwt.accessToken}&rft=${
        jwt.refreshToken
      }`,
    };
  }
  //#endregion

  @Get('refresh')
  @Public()
  @UseGuards(RefreshGuard)
  async refresh(@CurrentUser() user) {
    return this.authService.refresh(user.id, user.refreshToken);
  }

  @Post('logout')
  @HttpCode(202)
  async logout(@CurrentUser('id') userId: number) {
    return this.authService.logout(userId);
  }
}
