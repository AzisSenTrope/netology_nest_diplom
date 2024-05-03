import { CommonQuery, ID } from '../../common/types';

export type CreateSupportRequestParams = {
  text: string;
};

export type CreateSupportRequestMessageParams = {
  text: string;
};

export type MarkAsReadParams = {
  createdBefore: string;
};

export type GetSupportRequestsQueryParams = CommonQuery & {
  isActive?: boolean;
};

export type SendMessageParams = {
  author: string;
  supportRequest: string;
  text: string;
};

export type MarkMessagesAsReadParams = {
  user?: string;
  supportRequest: string;
  createdBefore: Date;
};

export type GetChatListParams = CommonQuery & {
  user?: ID | null;
  isActive?: boolean;
};
