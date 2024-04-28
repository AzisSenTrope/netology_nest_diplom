import {Model} from 'mongoose';

import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {HotelRoom} from "./schema";
import {CreateRoomParams, SearchRoomsParams, UpdateHotelRoomParams} from "./room.types";
import {HotelRoomDocument} from "./schema/hotelRoom.schema";
import {ID} from "../../../common/types";
import {PUBLIC_DIR} from "../../../common/consts";

@Injectable()
export class RoomService {
    constructor(@InjectModel(HotelRoom.name) private roomModel: Model<HotelRoom>) {}

    async create(data: CreateRoomParams): Promise<HotelRoomDocument> {
        const { hotelId, description, images } = data;
        const hotelRoom = await new this.roomModel({
            description,
            images: images.map((image) => image.path?.replace(PUBLIC_DIR, '')),
            hotel: hotelId,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).save();

        return await hotelRoom.populate('hotel');
    }

    async findById(id: ID): Promise<HotelRoomDocument> {
        return await this.roomModel.findById(id);
    }

    async search({
                     limit,
                     offset,
                     hotel,
                     isEnabled,
                 }: SearchRoomsParams): Promise<HotelRoomDocument[]> {
        const query = this.roomModel.find({ hotel, isEnabled });

        if (offset) {
            query.skip(offset);
        }

        if (limit) {
            query.limit(limit);
        }

        return await query.exec();
    }

    async update(
        id: ID,
        data: UpdateHotelRoomParams,
    ): Promise<HotelRoomDocument> {
        const hotelRoom = await this.roomModel.findByIdAndUpdate(id, data);

        return await hotelRoom.populate('hotel');
    }
}