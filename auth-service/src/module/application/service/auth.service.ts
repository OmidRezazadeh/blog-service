import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash } from 'bcrypt';

const PASSWORD_SALT_ROUNDS = 10;
const FIRST_USER_ID = 1;

interface StoredUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;
}

interface RegisterUserInput {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

interface TokenResponse {
  readonly accessToken: string;
  readonly tokenType: 'Bearer';
}

export interface AuthenticatedUser {
  readonly id: number;
  readonly email: string;
}

/**
 * Issues access tokens and keeps registered users in memory.
 */
@Injectable()
export class AuthService {
  private users: readonly StoredUser[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      passwordHash: '',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      passwordHash: '',
    },
  ];

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Returns every stored user without the password hash.
   */
  async findAll(): Promise<
    ReadonlyArray<{ readonly id: number; readonly name: string; readonly email: string }>
  > {
    return this.users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));
  }

  /**
   * Signs a JWT for an authenticated user.
   */
  async generateAccessToken(user: AuthenticatedUser): Promise<string> {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
  }

  /**
   * Stores a new user and returns a bearer access token.
   */
  async register(user: RegisterUserInput): Promise<TokenResponse> {
    this.assertEmailIsAvailable(user.email);
    const passwordHash = await hash(user.password, PASSWORD_SALT_ROUNDS);
    const registeredUser = this.saveUser({
      name: user.name,
      email: user.email,
      passwordHash,
    });
    return this.createTokenResponse(registeredUser);
  }

  /**
   * Returns a bearer access token for an existing user.
   */
  async login(user: AuthenticatedUser): Promise<TokenResponse> {
    return this.createTokenResponse(user);
  }

  private assertEmailIsAvailable(email: string): void {
    const normalizedEmail = email.toLowerCase();
    const emailIsTaken = this.users.some(
      (storedUser) => storedUser.email.toLowerCase() === normalizedEmail,
    );
    if (emailIsTaken) {
      throw new ConflictException('Email is already registered');
    }
  }

  private saveUser(user: Omit<StoredUser, 'id'>): StoredUser {
    const storedUser: StoredUser = {
      id: this.createNextUserId(),
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
    };
    this.users = [...this.users, storedUser];
    return storedUser;
  }

  private createNextUserId(): number {
    const lastUser = this.users.at(-1);
    if (!lastUser) {
      return FIRST_USER_ID;
    }
    return lastUser.id + 1;
  }

  private async createTokenResponse(user: AuthenticatedUser): Promise<TokenResponse> {
    return {
      accessToken: await this.generateAccessToken(user),
      tokenType: 'Bearer',
    };
  }
}
