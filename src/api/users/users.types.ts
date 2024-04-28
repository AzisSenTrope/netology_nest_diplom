import {Prop} from "@nestjs/mongoose";
import {ObjectId} from "mongoose";

export type Role = 'client' | 'admin' | 'manager';

export type ID = string | ObjectId;

export type User = {
     email: string;
     passwordHash: string;
     name: string;
     contactPhone: string;
     role?: Role;
}

export type UserDto = Omit<User, 'passwordHash'> & {password: string};

export type RegisterUserDto = Omit<UserDto, 'role'>;

export type SearchUserParams = {
     limit: number;
     offset: number;
     email: string;
     name: string;
     contactPhone: string;
}

export type IUserService = {
     create(data: Partial<User>): Promise<User>;
     findById(id: ID): Promise<User>;
     findByEmail(email: string): Promise<User>;
     findAll(params: SearchUserParams): Promise<User[]>;
}