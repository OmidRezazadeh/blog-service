import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDto } from '../../models/create-user.dto.js';
import { UserEntity } from '../../models/user.entity.js';

const PASSWORD_SALT_ROUNDS = 10;
const TOKEN_TYPE_BEARER = 'Bearer' as const;

interface TokenResponse {
  readonly accessToken: string;
  readonly tokenType: typeof TOKEN_TYPE_BEARER;
}

export interface AuthenticatedUser {
  readonly id: number;
  readonly email: string;
}

interface PublicUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
}

/**
 * Issues access tokens and persists users in PostgreSQL.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  /**
   * Returns every stored user without the password hash.
   */
  async findAll(): Promise<ReadonlyArray<PublicUser>> {
    const users: UserEntity[] = await this.userRepository.find();
    return users.map((user: UserEntity): PublicUser => ({
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
  async create(user: CreateUserDto): Promise<TokenResponse> {
    console.log('create', user);
    await this.assertEmailIsAvailable(user.email);
    const passwordHash: string = await hash(user.password, PASSWORD_SALT_ROUNDS);
    const createdUser: UserEntity = this.userRepository.create({
      name: user.name,
      email: user.email.toLowerCase(),
      passwordHash,
    });
    await this.userRepository.save(createdUser);
    return this.createTokenResponse(createdUser);
  }

  /**
   * Returns a bearer access token for an existing user.
   */
  async login(user: AuthenticatedUser): Promise<TokenResponse> {
    return this.createTokenResponse(user);
  }

  private async assertEmailIsAvailable(email: string): Promise<void> {
    const normalizedEmail: string = email.toLowerCase();
    const existingUser: UserEntity | null = await this.userRepository.findOne({
      where: { email: normalizedEmail },
    });
    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }
  }

  private async createTokenResponse(user: AuthenticatedUser): Promise<TokenResponse> {
    return {
      accessToken: await this.generateAccessToken(user),
      tokenType: TOKEN_TYPE_BEARER,
    };
  }
}
