import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Put,
  UseInterceptors,
  UploadedFiles,
  SerializeOptions, UseGuards,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express/multer';
import {HotelService} from "./hotel.service";
import {CreateHotelDto, SearchHotelParams, UpdateHotelParams} from "./hotel.types";
import {ID} from "../../../common/types";
import {Roles} from "../../auth/decorators/roles.auth-decorator";
import {RolesGuard} from "../../auth/guards/roles.guard";
import {AuthenticatedGuard} from "../../auth/guards/authenticated.guard";
import {USER_ROLE} from "../../../common/consts";


@Controller()
export class HotelController {
  constructor(
    private readonly hotelService: HotelService,
  ) {}

  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('admin/hotels')
  async createHotel(@Body() data: CreateHotelDto) {
    return await this.hotelService.create(data);
  }

  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('admin/hotels')
  async getHotels(@Query() query: SearchHotelParams) {
    return await this.hotelService.search(query);
  }

  @Roles(USER_ROLE.ADMIN)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Put('admin/hotels/:id')
  async updateHotel(@Param('id') id: ID, @Body() data: UpdateHotelParams) {
    return await this.hotelService.update(id, data);
  }
}
