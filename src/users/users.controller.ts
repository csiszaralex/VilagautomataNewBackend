import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { AppConfig } from 'src/utils/app.config';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly configService: ConfigService<AppConfig>,
    private readonly jwtService: JwtService,
  ) {}

  @Get('token')
  @Public()
  async token(@Query('jwt') jwt: string) {
    const secret = this.configService.get('auth.jwt.accessToken.secret');
    const data = this.jwtService.verify(jwt, { secret });
    return { ...data, jwt };
  }

  @Get('test')
  @UseGuards(AuthGuard('jwt'))
  async test() {
    return 'ok';
  }
}
