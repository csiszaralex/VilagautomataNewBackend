import { InternalServerErrorException, createParamDecorator } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/JwtPayload.interface';

export const CurrentUser = createParamDecorator<keyof JwtPayload | undefined>((key, ctx) => {
  const user: JwtPayload = ctx.switchToHttp().getRequest().user;

  if (!user)
    throw new InternalServerErrorException('CurrentUser decorator invoked without authGuard');
  if (key && !user.hasOwnProperty(key))
    throw new InternalServerErrorException(`Unknown key ${key} in CurrentUser decorator`);

  return key ? user[key] : user;
});
