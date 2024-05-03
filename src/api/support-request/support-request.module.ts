import { Module } from '@nestjs/common';

import { SupportRequestApiController } from './support-request.controller';
import { SupportRequestGateway } from './support-request.gateway';
import {
  Message,
  MessageSchema,
  SupportRequest,
  SupportRequestSchema,
} from './schema';
import { User, UsersSchema } from '../users/schemas/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SupportRequestService } from './services/support-request.service';
import { SupportRequestClientService } from './services/support-request-client.service';
import { SupportRequestEmployeeService } from './services/support-request-employee.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportRequestSchema },
      { name: Message.name, schema: MessageSchema },
      { name: User.name, schema: UsersSchema },
    ]),
  ],
  providers: [
    SupportRequestGateway,
    SupportRequestService,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
  controllers: [SupportRequestApiController],
})
export class SupportRequestApiModule {}
