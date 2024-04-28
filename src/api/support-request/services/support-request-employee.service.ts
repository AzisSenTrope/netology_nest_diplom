import {Model} from 'mongoose';

import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';

import {Message, SupportRequest} from '../schema';
import {User} from "../../users/schemas/users.schema";
import {USER_ROLE} from "../../../common/consts";
import {MarkMessagesAsReadParams} from "../support-request.types";

@Injectable()
export class SupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private supportRequestModel: Model<SupportRequest>,
    @InjectModel(Message.name)
    private messageModel: Model<Message>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Предполагается что прочитанными помечаются только сообщения от клиента, но прямого доступа к его ID у нас нет
  // Поэтому фильтруем сообщения по роли автора - помечаем прочитанными только сообщения НЕ ОТ менеджеров
  async markMessagesAsRead({
    supportRequest,
    createdBefore,
  }: MarkMessagesAsReadParams) {
    const supportRequestDocument =
      await this.supportRequestModel.findById(supportRequest);
    const messageIds = supportRequestDocument.get('messages');

    const managerUsers = await this.userModel
      .find({ role: USER_ROLE.MANAGER })
      .select('_id');

    return await this.messageModel
      .updateMany(
        {
          _id: { $in: messageIds },
          author: { $nin: managerUsers },
          sentAt: { $lte: createdBefore },
        },
        { $set: { readAt: new Date() } },
      )
      .exec();
  }

  async getUnreadCount(supportRequest: string): Promise<number> {
    const user = await this.supportRequestModel
      .findById(supportRequest)
      .get('user');

    return await this.messageModel
        .countDocuments({
            supportRequest,
            user,
            isRead: false,
        })
        .exec();
  }

  async closeRequest(supportRequestId: string): Promise<void> {
    await this.supportRequestModel.updateOne(
      {
        _id: supportRequestId,
      },
      {
        isActive: false,
      },
    );
  }
}
