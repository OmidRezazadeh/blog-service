import { ApiProperty } from '@nestjs/swagger';

/**
 * Access token returned after a user registers.
 */
export class AccessTokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImphbmUuc21pdGhAZXhhbXBsZS5jb20ifQ.signature',
  })
  readonly accessToken!: string;
}
