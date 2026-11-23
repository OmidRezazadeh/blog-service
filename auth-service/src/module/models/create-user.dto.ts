import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;

/**
 * Payload required to create a new user account.
 */
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_NAME_LENGTH)
  readonly name!: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(MAX_EMAIL_LENGTH)
  readonly email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  readonly password!: string;
}
