// interface GetHotelsQueryParams extends Paginated {}

import {ObjectId} from "mongoose";



export type CreateHotelDto = {
  title: string;
  description: string;
}

export type UpdateHotelParams = CreateHotelDto;

export type CreateHotel = CreateHotelDto & {id: string}

export type SearchHotelParams = {
  limit: number;
  offset: number;
  title: string;
}

// interface UpdateHotelParams extends CreateHotelParams {}

// interface CreateHotelRoomParams {
//   description: string;
//   hotelId: string;
//   images: Express.Multer.File[];
// }

// interface UpdateHotelRoomParams extends CreateHotelRoomParams {
//   images: string[];
// }
