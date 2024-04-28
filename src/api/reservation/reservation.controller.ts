import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post, Request,
  SerializeOptions, UseGuards,
} from '@nestjs/common';


import {CreateReservationParams} from "./reservatoin.types";
import {RoomService} from "../hotel/room/room.service";
import {ReservationService} from "./reservation.service";
import {HotelDocument} from "../hotel/hotel/schema/hotel.schema";
import {ID} from "../../common/types";
import {Roles} from "../auth/decorators/roles.auth-decorator";
import {USER_ROLE} from "../../common/consts";
import {AuthenticatedGuard} from "../auth/guards/authenticated.guard";
import {RolesGuard} from "../auth/guards/roles.guard";

@Controller()
export class ReservationApiController {
  constructor(
    private readonly reservationService: ReservationService,
    private readonly hotelRoomService: RoomService,
  ) {}

  @Roles(USER_ROLE.CLIENT)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('client/reservations')
  async createClientReservation(
      @Request() req,
      @Body() data: CreateReservationParams,
  ) {
    const user = req.user;
    const {startDate, endDate} = data;

    const hotelRoom = await this.hotelRoomService.findById(data.hotelRoom);

    return await this.reservationService.createReservation({
      dateStart: new Date(startDate),
      dateEnd: new Date(endDate),
      userId: user._id,
      hotelId: (hotelRoom.hotel as HotelDocument)._id as unknown as ID,
      roomId: hotelRoom._id as unknown  as ID,
    });
  }

  @Roles(USER_ROLE.CLIENT)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('client/reservations')
  async getClientReservations(@Request() req) {
    const user = req.user;

    return await this.reservationService.getReservations({ userId: user._id });
  }

  @Roles(USER_ROLE.MANAGER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('manager/reservations/:userId')
  async getManagerClientReservations(@Param('userId') userId: string) {
    return await this.reservationService.getReservations({ userId });
  }

  @Roles(USER_ROLE.CLIENT)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete('client/reservations/:id')
  async deleteClientReservation(
    @Param('íd') id: string,
    @Request() req,
  ): Promise<void> {
    const user = req.user;

    if (id !== user._id) {
      throw new ForbiddenException('Forbidden');
    }
    await this.reservationService.deleteReservation(id);
  }

  @Roles(USER_ROLE.MANAGER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Delete('manager/reservations/:userId')
  async deleteManagerClientReservation(
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.reservationService.deleteReservation(userId);
  }
}
