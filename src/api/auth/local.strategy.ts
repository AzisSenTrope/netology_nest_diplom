import * as bcrypt from 'bcrypt';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    let user = null;
    let isValidPassword = false;

    try {
      user = await this.usersService.findByEmail(email);
      isValidPassword = await bcrypt.compare(password, user?.passwordHash);

      if (user && isValidPassword) {
        return user;
      }
    } catch {
      throw new UnauthorizedException();
    }

    if (!user || !isValidPassword) {
      throw new UnauthorizedException();
    }

    return null;
  }
}
