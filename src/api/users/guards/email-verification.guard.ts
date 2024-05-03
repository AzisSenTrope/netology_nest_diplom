import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../users.service';

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isEmailRepeated = !!(await this.userService.findByEmail(
      request.body.email,
    ));

    if (isEmailRepeated) {
      throw new BadRequestException();
    }

    return true; // Если пользователь авторизован, продолжаем выполнение
  }
}
