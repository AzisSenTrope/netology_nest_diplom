import {BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {UsersService} from "../users.service";

@Injectable()
export class EmailVerificationGuard implements CanActivate {
  constructor(private reflector: Reflector, private userService: UsersService) {}

  async canActivate(context: ExecutionContext) {
    console.log('AuthenticatedGuard')
    const request = context.switchToHttp().getRequest();
    console.log({requestBode: request.body})
    const isEmailRepeated = !!await this.userService.findByEmail(request.body.email);
    console.log({isEmailRepeated});

    if (isEmailRepeated) {
      throw new BadRequestException();
    }

    return true; // Если пользователь авторизован, продолжаем выполнение
  }
}
