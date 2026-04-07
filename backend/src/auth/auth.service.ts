import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  // Hardcoded users for demo (in production, use database + hashed passwords)
  private readonly users = [
    {
      id: 1,
      username: 'awadaya18@gmail.com',
      email: 'awadaya18@gmail.com',
      password: 'Aya123',
      role: 'ADMIN',
    },
    {
      id: 2,
      username: 'user@smartbridge.com',
      email: 'user@smartbridge.com',
      password: 'User123',
      role: 'USER',
    },
    {
      id: 3,
      username: 'guest@smartbridge.com',
      email: 'guest@smartbridge.com',
      password: 'Guest123',
      role: 'USER',
    },
  ]

  constructor(private jwtService: JwtService) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    const normalizedIdentifier = identifier.trim().toLowerCase()

    const matchedUser = this.users.find((user) => {
      const usernameMatches = user.username.toLowerCase() === normalizedIdentifier
      const emailMatches = user.email.toLowerCase() === normalizedIdentifier
      return (usernameMatches || emailMatches) && user.password === password
    })

    if (!matchedUser) {
      return null
    }

    const { password: _password, ...result } = matchedUser
    return result
  }

  async login(user: any) {
    const payload = { 
      username: user.username, 
      sub: user.id,
      role: user.role,
    }
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token)
    } catch (error) {
      return null
    }
  }
}
