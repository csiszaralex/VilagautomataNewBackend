import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AppConfig } from 'src/utils/app.config';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    //TODO Remove this line if you don't want to use JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig>) => ({
        secret: configService.get<string>('auth.jwt.accessToken.secret'),
        signOptions: { expiresIn: configService.get<string>('auth.jwt.accessToken.expiresIn') },
      }),
    }),
  ],
})
export class UsersModule {}
