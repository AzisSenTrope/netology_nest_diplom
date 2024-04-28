import { Module } from '@nestjs/common';

import { HotelController } from './hotel/hotel.controller';
import {HotelService} from "./hotel/hotel.service";
import {MongooseModule} from "@nestjs/mongoose";
import {Hotel, HotelSchema} from "./hotel/schema";
import {MulterModule} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {join} from "path";
import {PUBLIC_DIR} from "../../common/consts";
import {editFileName} from "../../common/utils/utils";
import {HotelRoom, HotelRoomSchema} from "./room/schema";
import {RoomService} from "./room/room.service";
import {RoomController} from "./room/room.controller";

@Module({
  imports: [
    MongooseModule.forFeature([
          { name: Hotel.name, schema: HotelSchema }
        ]
    ),
      MulterModule.register({
          storage: diskStorage({
              destination: join(PUBLIC_DIR, 'upload'),
              filename: editFileName,
          }),
      }),
      MongooseModule.forFeature([
              { name: HotelRoom.name, schema: HotelRoomSchema }
          ]
      )
  ],
  providers: [HotelService, RoomService],
  controllers: [HotelController, RoomController],
  exports: [HotelService, RoomService],
})

export class HotelModule {}
