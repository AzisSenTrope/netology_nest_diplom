import { Module } from '@nestjs/common';
import { UsersModule } from './api/users/users.module';
import { AuthModule } from './api/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HotelModule } from './api/hotel/hotel.module';
import { ReservationApiModule } from './api/reservation/reservation.module';
import { SupportRequestApiModule } from './api/support-request/support-request.module';

@Module({
  imports: [
    SupportRequestApiModule,
    ReservationApiModule,
    HotelModule,
    UsersModule,
    AuthModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION),
  ],
})
export class AppModule {}
