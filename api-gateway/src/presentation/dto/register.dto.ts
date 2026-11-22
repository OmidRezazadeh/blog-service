import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;

/**
 * Payload required to register a new user.
 */
export class RegisterDto {
  @ApiProperty({ example: 'Jane Smith', maxLength: MAX_NAME_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MaxLength(MAX_NAME_LENGTH)
  name!: string;

  @ApiProperty({ example: 'jane.smith@example.com', maxLength: MAX_EMAIL_LENGTH })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(MAX_EMAIL_LENGTH)
  email!: string;

  @ApiProperty({ example: 'ChangeMe123', minLength: MIN_PASSWORD_LENGTH })
  @IsString()
  @IsNotEmpty()
  @MinLength(MIN_PASSWORD_LENGTH)
  password!: string;
}
