import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from '../../application/service/auth.service.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @MessagePattern('users.findAll')
    findAll(): Promise<
      ReadonlyArray<{ readonly id: number; readonly name: string; readonly email: string }>
    > {
        return this.authService.findAll();
    }

    @MessagePattern('auth.register')
    register(
      @Payload() registerDto: { name: string; email: string; password: string },
    ): Promise<{ readonly accessToken: string; readonly tokenType: 'Bearer' }> {
        return this.authService.register({
            name: registerDto.name,
            email: registerDto.email,
            password: registerDto.password,
        });
    }
}
