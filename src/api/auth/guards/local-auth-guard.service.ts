import {ExecutionContext, Injectable} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext) {
        const result = (await super.canActivate(context)) as boolean
        const request = context.switchToHttp().getRequest();

        await super.logIn(request);

        return result;
    }
    // public handleRequest(err, user, info) {
    //     if (err) {
    //         throw err;
    //     }
    //     if (!user) {
    //         throw new UnauthorizedException();
    //     }
    //     return user;
    // }
}