import { Module } from '@nestjs/common';

import { ReservationApiController } from './reservation.controller';
import { HotelModule } from '../hotel/hotel.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './schema/reservation.schema';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    HotelModule,
  ],
  providers: [ReservationService],
  controllers: [ReservationApiController],
})
export class ReservationApiModule {}
