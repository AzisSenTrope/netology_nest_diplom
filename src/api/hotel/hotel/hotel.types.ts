export type CreateHotelDto = {
  title: string;
  description: string;
};

export type UpdateHotelParams = CreateHotelDto;

export type CreateHotel = CreateHotelDto & { id: string };

export type SearchHotelParams = {
  limit: number;
  offset: number;
  title: string;
};
