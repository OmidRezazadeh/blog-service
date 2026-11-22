import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { AuthService } from '../../application/services/auth.service.js';
import { AccessTokenResponseDto } from '../dto/access-token-response.dto.js';
import { LoginDto } from '../dto/login.dto.js';
import { RegisterDto } from '../dto/register.dto.js';
import { UserResponseDto } from '../dto/user-response.dto.js';

/**
 * HTTP endpoints for authentication and user lookup.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return { message: 'Login successful' };
  }
  /**
   * Registers a user and returns an access token.
   */
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiCreatedResponse({
    description: 'Access token for the registered user.',
    type: AccessTokenResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AccessTokenResponseDto> {
    return this.authService.register(registerDto);
  }

  /**
   * Returns every user from the user service.
   */
  @Get('users')
  @ApiOperation({ summary: 'List all users' })
  @ApiOkResponse({
    description: 'Users returned by the user service.',
    type: UserResponseDto,
    isArray: true,
  })
  findAll(): Observable<UserResponseDto[]> {
    return this.authService.findAll();
  }


}
