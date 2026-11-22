import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices/client/index.js';

export interface AuthenticatedUser {
  id: number;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService,
    @Inject('USER_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async generateAccessToken(user: AuthenticatedUser): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
  }

  async register(user: {
    readonly name: string;
    readonly email: string;
    readonly password: string;
  }): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync({
      email: user.email,
      name: user.name,
    });
    return { accessToken };
  }

  async login(user: AuthenticatedUser) {
    return this.createTokenResponse(user);
  }

  private async createTokenResponse(user: AuthenticatedUser) {
    return {
      accessToken: await this.generateAccessToken(user),
    };
  }
  findAll() {
  return this.client.send('users.findAll', {});
}

}
