import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

export enum UserHKRole {
  KORVEZETO = 'KORVEZETO',
  TAG = 'TAG',
  OREGTAG = 'OREGTAG',
  GUEST = 'GUEST',
}

export class UserEntity {
  @IsInt()
  @Min(0)
  id: number;

  @IsUUID('all')
  authSchId: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  firstName: string;

  @IsOptional()
  @IsBoolean()
  isAdmin: boolean;

  @IsOptional()
  rtHash: string;

  @IsOptional()
  @IsDate()
  createdAt: Date;

  @IsOptional()
  @IsDate()
  updatedAt: Date;

  @IsOptional()
  salt: string;

  @IsIn(Object.values(UserHKRole))
  role: UserHKRole;
}
