import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../../application/service/auth.service.js';
import { CreateUserDto } from '../../models/create-user.dto.js';

/**
 * RabbitMQ message handlers for authentication and user lookups.
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Returns every stored user without the password hash.
   */
  @MessagePattern('users.findAll')
  findAll(): Promise<
    ReadonlyArray<{ readonly id: number; readonly name: string; readonly email: string }>
  > {
    return this.authService.findAll();
  }

  /**
   * Creates a user account and returns a bearer access token.
   */
  @MessagePattern('auth.register')
  create(
    @Payload() createUserDto: CreateUserDto,
  ): Promise<{ readonly accessToken: string; readonly tokenType: 'Bearer' }> {
    return this.authService.create(createUserDto);
  }
}
