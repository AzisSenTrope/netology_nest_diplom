import {ID} from "../../../common/types";

export type UpdateHotelDto = {
    title: string;
    description: string;
}

export type CreateRoomParams = {
  description: string;
  hotelId: string;
  images: Express.Multer.File[];
}

export type UpdateHotelRoomParams = Omit<CreateRoomParams, 'images'> & {
  images: string[];
}

export type SearchRoomsParams = {
    limit: number;
    offset: number;
    hotel: ID;
    isEnabled?: boolean;
}