import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { firstValueFrom } from 'rxjs';

const AUTHSCH_HOST = 'https://auth.sch.bme.hu';

@Injectable()
export class AuthschStrategy extends PassportStrategy(Strategy, 'authsch') {
  constructor(private httpService: HttpService, private configService: ConfigService) {
    super({
      authorizationURL: `${AUTHSCH_HOST}/site/login`,
      tokenURL: `${AUTHSCH_HOST}/oauth2/token`,
      clientID: configService.get<string>('auth.authsch.clientID'),
      clientSecret: configService.get<string>('auth.authsch.clientSecret'),
      callbackURL: configService.get<string>('auth.authsch.callbackURL'),
      scope: [
        'basic',
        'displayName',
        'sn',
        'givenName',
        'mail',
        // 'niifPersonOrgID', //Csak kérésre engedélyezik
        // 'linkedAccounts',
        'eduPersonEntitlement',
        // 'mobile',
        // 'niifEduPersonAttendedCourse',
        // 'entrants',
        // 'admembership',
        // 'bmeunitscope',
        // 'permanentaddress',
        // 'roomNumber', //Nem elérhető
      ],
    });
  }

  async validate(accessToken: string, refreshToken: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${AUTHSCH_HOST}/api/profile?access_token=${accessToken}`),
    );
    //TODO refresh tokent tárolni, hogy minden refresh-nél a háttérben ellenőrizze még körtag-e

    return data;
  }
}
