import { OmitType } from '@nestjs/swagger';
import { UserEntity } from './UserEntity.dto';

export class CreateUserDto extends OmitType(UserEntity, [
  'id',
  'isAdmin',
  'rtHash',
  'createdAt',
  'updatedAt',
  'salt',
]) {}
