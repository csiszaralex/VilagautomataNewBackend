import { ForbiddenException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'bcrypt';
import { UserHKRole } from 'src/users/dto/UserEntity.dto';
import { UsersService } from 'src/users/users.service';
import { AppConfig } from 'src/utils/app.config';
import { JwtPayload } from './interfaces/JwtPayload.interface';
import { OAuthUser } from './interfaces/OAuthUser.interface';
import { SignInPayload } from './interfaces/SignInPayload.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async findOrCreateUser(oAuthUser: OAuthUser): Promise<User> {
    let hkRole: UserHKRole;

    const hk = oAuthUser.eduPersonEntitlement.find(
      kor => kor.id == 68 && kor.name == 'Kari Hallgatói Képviselet',
    );

    if (!hk) hkRole = UserHKRole.GUEST;
    else if (hk.status == 'körvezető') hkRole = UserHKRole.KORVEZETO;
    else if (hk.status == 'tag' && hk.title.includes('Képviselő')) hkRole = UserHKRole.TAG;
    else {
      hkRole = UserHKRole.GUEST;
    }

    //TODO frissíteni néha a körtagságokat
    const user = await this.usersService.findByAuthSchId(oAuthUser.internal_id);
    if (user) return user;

    return this.usersService.createUser({
      name: oAuthUser.displayName,
      firstName: oAuthUser.givenName,
      email: oAuthUser.mail,
      authSchId: oAuthUser.internal_id,
      role: hkRole,
    });
  }
  async generateToken(user: User): Promise<SignInPayload> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      firstName: user.firstName,
    };

    const accessToken = await this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.jwt.accessToken.secret'),
      expiresIn: this.configService.get<string>('auth.jwt.accessToken.expiresIn'),
    });

    const refreshToken = await this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get<string>('auth.jwt.refreshToken.secret'),
        expiresIn: this.configService.get<string>('auth.jwt.refreshToken.expiresIn'),
      },
    );
    await this.usersService.updateRtHash(user.id, user.salt, refreshToken);
    return { accessToken, refreshToken };
  }

  async refresh(userId: number, refreshToken: string): Promise<SignInPayload> {
    const user = await this.usersService.findById(userId);
    if (!user) throw new ForbiddenException('Access denied');
    const rtHash = await hash(refreshToken, user.salt);
    if (user.rtHash !== rtHash) throw new UnauthorizedException('Invalid refresh token');
    return this.generateToken(user);
  }

  async logout(userId: number) {
    await this.usersService.updateRtHash(userId, '', '');
    return { message: 'Logout successful' };
  }
}
