import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
constructor(private readonly jwtService: JwtService) {}
 async generateAccessToken(userId: number): Promise<string> {
    const payload = {
      sub: userId,
    };

    return this.jwtService.signAsync(payload);
  }
  async login(id:number) {
  const accessToken = await this.generateAccessToken(id);

  return {
    accessToken,
    tokenType: 'Bearer',
  };
}
}
