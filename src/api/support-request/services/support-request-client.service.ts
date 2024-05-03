import { Model } from 'mongoose';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Message, SupportRequest } from '../schema';
import { SupportRequestDocument } from '../schema/support-request.schema';
import {
  CreateSupportRequestParams,
  MarkMessagesAsReadParams,
} from '../support-request.types';
import { User } from '../../users/schemas/users.schema';
import { ID } from '../../../common/types';

@Injectable()
export class SupportRequestClientService {
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestParams & { user: ID },
  ): Promise<SupportRequestDocument> {
    const newMessage = await this.messageModel.create({
      author: data.user,
      sentAt: new Date(),
      text: data.text,
      readAt: null,
    });

    const request = await this.supportRequestModel.create({
      user: data.user,
      isActive: true,
      hasNewMessages: true,
      messages: [newMessage._id],
      createdAt: new Date(),
    });

    return await request.save();
  }

  async markMessagesAsRead({
    user,
    supportRequest,
    createdBefore,
  }: MarkMessagesAsReadParams) {
    const supportRequestDocument = await this.supportRequestModel.findById(
      supportRequest,
    );
    const messageIds = supportRequestDocument.get('messages');

    return await this.messageModel.updateMany(
      {
        _id: { $in: messageIds },
        author: { $ne: user },
        sentAt: { $lte: createdBefore },
      },
      { $set: { readAt: new Date() } },
    );
  }

  async getUnreadCount(supportRequest: string): Promise<number> {
    const managers = await this.userModel.find({ role: 'manager' }).exec();

    const messagesCount = await this.messageModel
      .countDocuments({
        author: { $in: [managers] },
        supportRequest,
        isRead: false,
      })
      .exec();

    return messagesCount;
  }
}
