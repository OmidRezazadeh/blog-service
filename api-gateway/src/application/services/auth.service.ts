import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices/client/index.js';
import { firstValueFrom } from 'rxjs';

export interface AuthenticatedUser {
  id: number;
  email: string;
  name: string;
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
    name: user.name,
  });
}

async register(user: {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}): Promise<{ accessToken: string }> {
  return firstValueFrom(
    this.client.send<{ accessToken: string }>('auth.register', user),
  );
}

private async createTokenResponse(user: AuthenticatedUser): Promise<{
  accessToken: string;
}> {
  return {
    accessToken: await this.generateAccessToken(user),
  };
}
  
  findAll() {
  return this.client.send('users.findAll', {});
}
  async login(user: AuthenticatedUser) {
    return this.createTokenResponse(user);
  }

}
