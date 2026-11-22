import { ApiProperty } from '@nestjs/swagger';

/**
 * User returned by the user service.
 */
export class UserResponseDto {
  @ApiProperty({ example: 1 })
  readonly id!: number;

  @ApiProperty({ example: 'John Doe' })
  readonly name!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  readonly email!: string;
}
