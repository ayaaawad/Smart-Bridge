import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const identifier = loginDto.email ?? loginDto.username

    if (!identifier || !loginDto.password) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const user = await this.authService.validateUser(identifier, loginDto.password)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return this.authService.login(user)
  }

  @Post('validate')
  async validateToken(@Body() body: { token: string }) {
    const payload = await this.authService.validateToken(body.token)
    if (!payload) {
      return { valid: false }
    }
    return { 
      valid: true, 
      user: { 
        username: payload.username, 
        role: payload.role 
      } 
    }
  }
}
