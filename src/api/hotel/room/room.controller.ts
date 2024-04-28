import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query, Request,
    UploadedFile,
    UploadedFiles, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express/multer";
import {ID} from "../../../common/types";
import {CreateRoomParams, SearchRoomsParams, UpdateHotelRoomParams} from "./room.types";
import {RoomService} from "./room.service";
import {PUBLIC_DIR, USER_ROLE} from "../../../common/consts";
import {Roles} from "../../auth/decorators/roles.auth-decorator";
import {AuthenticatedGuard} from "../../auth/guards/authenticated.guard";
import {RolesGuard} from "../../auth/guards/roles.guard";

export class SampleDto {
    name: string;
}


@Controller('room')
export class RoomController {
    constructor(
        private readonly roomService: RoomService,
    ) {}

    @Get('common/hotel-rooms')
    async getRooms(
        @Query() query: SearchRoomsParams,
        @Request() req,
    ) {
        const user = req.user;
        let {isEnabled} = query;

        if (!user || user?.role == USER_ROLE.CLIENT) {
            isEnabled = true;
        }

        return await this.roomService.search({
            ...query,
            isEnabled,
        });
    }

    @UseInterceptors(FileInterceptor('file'))
    @Post('file')
    uploadFile(
        @Body() body: SampleDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return {
            body,
            file: file.buffer?.toString(),
        };
    }

    @Get('common/hotel-rooms/:id')
    async getHotelRoom(@Param('id') id: ID) {
        return await this.roomService.findById(id);
    }

    @Roles(USER_ROLE.ADMIN)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Post('admin/hotel-rooms')
    @UseInterceptors(FilesInterceptor('images', 10))
    async createHotelRoom(
        @Body() data: CreateRoomParams,
        @UploadedFiles() images: Array<Express.Multer.File>,
    ) {
        return await this.roomService.create({ ...data, images });
    }

    @Roles(USER_ROLE.ADMIN)
    @UseGuards(AuthenticatedGuard, RolesGuard)
    @Put('admin/hotel-rooms/:id')
    @UseInterceptors(FilesInterceptor('images', 10))
    async updateHotelRoom(
        @Param('id') roomId: ID,
        @Body() data: UpdateHotelRoomParams,
        @UploadedFiles() files: Array<Express.Multer.File>,
    ) {
        const images = [
            ...data.images,
            ...(files
                ? files.map((image) => image.path.replace(PUBLIC_DIR, ''))
                : []),
        ];

        return await this.roomService.update(roomId, { ...data, images });
    }
}
