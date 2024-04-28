import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.usersService.findByEmail(email);



        if (user && user.passwordHash === password) {
            return user;
        }

        return null;
    }

    // async validateUser(id: number): Promise<any> {
    //     const user = await this.usersService.findOne(id);
    //     if (user) {
    //         return user;
    //     }
    //     return null;
    // }

    // createToken(payload: any) {
    //     return this.jwtService.sign(payload);
    // }
}