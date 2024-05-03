import { Model } from 'mongoose';

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Reservation, ReservationDocument } from './schema/reservation.schema';
import {
  CreateReservationDto,
  ReservationSearchParams,
} from './reservatoin.types';

@Injectable()
export class ReservationService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async createReservation(
    data: CreateReservationDto,
  ): Promise<ReservationDocument> {
    const { hotelId, roomId, dateStart, dateEnd } = data;
    const room = await this.reservationModel.find({ roomId });

    if (!room) {
      throw new BadRequestException('Room with given ID does not exist');
    }

    const countDocuments = await this.reservationModel.countDocuments({
      roomId,
      hotelId,
      dateStart: { $lte: new Date(dateEnd).toISOString() },
      dateEnd: { $gte: new Date(dateStart).toISOString() },
    });

    const roomAvailable = countDocuments === 0;

    if (!roomAvailable) {
      throw new BadRequestException('Room is not available');
    }

    const reservation = new this.reservationModel(data);

    return await (await reservation.save()).populate(['hotelId', 'roomId']);
  }

  async deleteReservation(id: string): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchParams,
  ): Promise<ReservationDocument[]> {
    const query = this.reservationModel.find(filter);

    return await query.populate(['hotelId', 'roomId']).exec();
  }
}
