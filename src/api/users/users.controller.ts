import {Body, Controller, Get, Post, Query, Request, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {RegisterUserDto, SearchUserParams, UserDto} from "./users.types";
import {UserDocument} from "./schemas/users.schema";
import {EmailVerificationGuard} from "./guards/email-verification.guard";

@Controller()
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @Post('admin/users')
    create(@Body() body: UserDto): Promise<UserDocument> {
        return this.userService.create(body);
    }

    @UseGuards(EmailVerificationGuard)
    @Post('client/register')
    async register(@Request() req, @Body() body: RegisterUserDto) {
        const user = await this.userService.create(body);

        // После регистрации сразу же аунтефицируемся
        req.login(user, (err) => {
            if (err) {
                throw err;
            }
            // Пользователь успешно аутентифицирован
        });

        return user;
    }

    @Get('admin/users')
    async getUsersForAdmin(@Query() searchParams: SearchUserParams) {
        return await this.userService.search(searchParams);
    }

    @Get('manager/users')
    async getUsersForManager(@Query() searchParams: SearchUserParams) {
        return await this.userService.search(searchParams);
    }
}
