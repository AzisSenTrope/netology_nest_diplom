import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {User} from "../../users/schemas/users.schema";
import {Hotel} from "../../hotel/hotel/schema";
import {HotelRoom} from "../../hotel/room/schema";

@Schema()
export class Reservation {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: false,
  })
  userId: User;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Hotel',
    required: true,
    unique: false,
  })
  hotelId: Hotel;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'HotelRoom',
    required: true,
    unique: false,
  })
  roomId: HotelRoom;

  @Prop({
    type: MongooseSchema.Types.Date,
    required: true,
    unique: false,
  })
  dateStart: Date;

  @Prop({
    type: MongooseSchema.Types.Date,
    required: true,
    unique: false,
  })
  dateEnd: Date;
}

export type ReservationDocument = HydratedDocument<Reservation>;
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
