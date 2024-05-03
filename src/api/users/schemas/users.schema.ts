import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from '../users.types';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  public email: string;

  @Prop({ required: true })
  public passwordHash: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: true })
  public contactPhone: string;

  @Prop()
  public role?: Role;
}

export const UsersSchema = SchemaFactory.createForClass(User);
