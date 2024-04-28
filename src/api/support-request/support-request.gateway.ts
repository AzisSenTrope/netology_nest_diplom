import { Server } from 'socket.io';

import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import {USER_ROLE} from "../../common/consts";
import {MessageDocument} from "./schema/message.schema";
import {SupportRequestDocument} from "./schema/support-request.schema";
import {SupportRequestService} from "./services/support-request.service";
import {Roles} from "../auth/decorators/roles.auth-decorator";

@WebSocketGateway({ namespace: 'support-request' })
export class SupportRequestGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly supportRequestService: SupportRequestService) {}

  @SubscribeMessage('subscribeToChat')
  @Roles(USER_ROLE.CLIENT, USER_ROLE.MANAGER)
  async subscribeToChat(@MessageBody() chatId: string) {
    const handler = (
      supportRequest: SupportRequestDocument,
      message: MessageDocument,
    ) => {
      const supportRequestId = supportRequest._id.toString();
      this.server
        .to(`support-request-${supportRequestId}`)
        .emit('new message', message);
    };

    this.supportRequestService.subscribe(handler);

    this.server.emit(
      'subscription result',
      `You have subscribed to messages from chat ${chatId}`,
    );
  }
}
