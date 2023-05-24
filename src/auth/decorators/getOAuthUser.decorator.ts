import { createParamDecorator } from '@nestjs/common';
import { OAuthUser } from '../interfaces/OAuthUser.interface';

export const GetOAuthUser = createParamDecorator((_, ctx) => {
  const req = ctx.switchToHttp().getRequest();
  const user: OAuthUser = req.user;
  return user;
});
