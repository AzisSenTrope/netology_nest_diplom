import {CommonQuery, ID} from "../../common/types";
import {Message, SupportRequest} from "./schema";

export type CreateSupportRequestParams = {
  text: string;
}

export type CreateSupportRequestMessageParams = {
  text: string;
}

export type MarkAsReadParams = {
  createdBefore: string;
}

export type GetSupportRequestsQueryParams = CommonQuery & {
  isActive?: boolean;
}

export type CreateSupportRequestDto = {
  user: ID;
  text: string;
}

export type SendMessageParams = {
  author: string;
  supportRequest: string;
  text: string;
}

export type MarkMessagesAsReadParams = {
  user?: string;
  supportRequest: string;
  createdBefore: Date;
}

export type GetChatListParams = CommonQuery & {
  user?: ID | null;
  isActive?: boolean;
}

interface ISupportRequestService {
  findSupportRequests(params: GetChatListParams): Promise<SupportRequest[]>;
  sendMessage(data: SendMessageParams): Promise<Message>;
  getMessages(supportRequest: ID): Promise<Message[]>;
  subscribe(
      handler: (supportRequest: SupportRequest, message: Message) => void,
  ): void;
}

interface ISupportRequestClientService {
  createSupportRequest(data: CreateSupportRequestDto): Promise<SupportRequest>;
  markMessagesAsRead(params: MarkMessagesAsReadParams);
  getUnreadCount(supportRequest: ID): Promise<number>;
}

interface ISupportRequestEmployeeService {
  markMessagesAsRead(params: MarkMessagesAsReadParams);
  getUnreadCount(supportRequest: ID): Promise<number>;
  closeRequest(supportRequest: ID): Promise<void>;
}

