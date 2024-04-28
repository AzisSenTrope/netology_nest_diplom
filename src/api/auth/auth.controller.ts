import {Controller, Post, UseGuards, Request, Get, SerializeOptions, Res} from '@nestjs/common';
import {LocalAuthGuard} from "./guards/local-auth-guard.service";
import {AuthenticatedGuard} from "./guards/authenticated.guard";
import {NonAuthenticatedGuard} from "./guards/non-authenticated.guard";

@SerializeOptions({ strategy: 'excludeAll' })
@Controller()
export class AuthController {
    @UseGuards(NonAuthenticatedGuard, LocalAuthGuard)
    @Post('auth/login')
    async login(@Request() req) {
        console.log('login ', {req});
        return req.user;
    }

    @UseGuards(AuthenticatedGuard)
    @Post('auth/logout')
    async logout(@Request() req, @Res() res): Promise<void> {
        req.session.destroy();
        res.clearCookie('connect.sid');
        res.status(204).send();
    }
}
