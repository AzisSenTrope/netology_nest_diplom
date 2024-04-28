import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectConnection, InjectModel} from "@nestjs/mongoose";
import {Connection, Model} from "mongoose";
import {User as UserDB, UserDocument} from "./schemas/users.schema";
import {SearchUserParams, User, UserDto} from "./users.types";
import {HASH_SALT} from '../../common/consts';
import * as bcrypt from 'bcrypt';
import {InternalServerErrorException} from "@nestjs/common/exceptions/internal-server-error.exception";

const MAIN_ADMIN: UserDto  = {
    email: 'bars@yandrx.ru',
    password: 'g', //g
    name: '2',
    contactPhone: ';',
    role: 'admin',
}

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserDB.name) private UserModel: Model<UserDocument>,
        @InjectConnection() private connection: Connection,
    ) {
        this.create(MAIN_ADMIN);
    }

    async create(data: UserDto): Promise<UserDocument> {
        try {
            const {password, ...dataWithoutPassword} = data;
            const passwordHash: User['passwordHash'] = await bcrypt.hash(password, HASH_SALT);
            const preparedData: User = !data['role'] ?
                {...dataWithoutPassword, role: 'client', passwordHash} :
                {...dataWithoutPassword, passwordHash};
            const user = new this.UserModel(preparedData);
            return await user.save();
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async findByEmail(email: string): Promise<UserDocument> {
        try {
            return this.UserModel.findOne({
                email: {$regex: email, $options: 'i'},
            });
        } catch (err) {
            throw new InternalServerErrorException();
        }
    }

    async findAll(): Promise<UserDocument[]> {
        return await this.UserModel.find();
    }

    async search(params: SearchUserParams): Promise<UserDocument[]> {
        const query: { [key: string]: any } = {};

        if (params.contactPhone) {
            query.contactPhone = { $regex: params.contactPhone, $options: 'i' };
        }

        if (params.name) {
            query.name = {$regex: params.name, $options: 'i'};
        }

        if (params.email) {
            query.email = {$regex: params.email, $options: 'i'};
        }

        if (params.offset) {
            query.skip(params.offset);
        }

        if (params.limit) {
            query.limit(params.limit);
        }

        return await this.UserModel.find(query);
    }
}