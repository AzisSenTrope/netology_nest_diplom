import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import {
  CreateHotel,
  CreateHotelDto,
  SearchHotelParams,
  UpdateHotelParams,
} from './hotel.types';
import { Hotel, HotelDocument } from './schema/hotel.schema';
import { ID } from '../../../common/types';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectConnection() private connection: Connection,
  ) {}
  async create(data: CreateHotelDto): Promise<CreateHotel> {
    const hotel = new this.hotelModel({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await hotel.save();

    return { id: hotel.id, description: hotel.description, title: hotel.title };
  }

  async search(params: SearchHotelParams): Promise<HotelDocument[]> {
    const query = this.hotelModel.find();

    if (params.title) {
      query.where({ title: { $regex: params.title, $options: 'i' } });
    }

    if (params.offset) {
      query.skip(Number(params.offset));
    }

    if (params.limit) {
      query.limit(Number(params.limit));
    }

    return await query.exec();
  }

  async update(id: ID, data: UpdateHotelParams): Promise<HotelDocument> {
    return await this.hotelModel.findByIdAndUpdate(id, data);
  }

  async findById(id: ID): Promise<HotelDocument> {
    return await this.hotelModel.findById(id);
  }
}
