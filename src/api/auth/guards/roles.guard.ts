import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {ROLES_KEY} from "../decorators/roles.auth-decorator";
import {ForbiddenException} from "@nestjs/common/exceptions/forbidden.exception";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
        context.getHandler(),
        context.getClass(),
    ]) as Array<string>;
    const route = request.originalUrl.split('/');
    const user = request.user;
    const reqRole = user.role
    const routeRole = route[2];
    // const routeAllowed = user && userRoles.includes(user?.role);

    if (reqRole === routeRole && requiredRoles.includes(routeRole) ) {
      return true;
    }

    throw new ForbiddenException()

    // if (!request.isAuthenticated()) {
    //   // Если пользователь не авторизован, бросаем исключение
    //   throw new UnauthorizedException();
    // }
    //
    // return true; // Если пользователь авторизован, продолжаем выполнение
  }
}
