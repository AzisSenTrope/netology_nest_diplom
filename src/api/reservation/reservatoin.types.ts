import { ID } from '../../common/types';

export type CreateReservationParams = {
  hotelRoom: string;
  startDate: string;
  endDate: string;
};

export type CreateReservationDto = {
  userId: ID;
  hotelId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
};

export type ReservationSearchParams = {
  userId: ID;
  dateStart?: Date;
  dateEnd?: Date;
};
