import { ObjectId } from 'mongoose';

export type ID = string | ObjectId;

export type CommonQuery = {
  offset?: number;
  limit?: number;
};
