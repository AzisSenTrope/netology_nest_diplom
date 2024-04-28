import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
  Request,
  SerializeOptions, UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  CreateSupportRequestMessageParams,
  CreateSupportRequestParams,
  GetSupportRequestsQueryParams,
  MarkAsReadParams
} from "./support-request.types";
import {Roles} from "../auth/decorators/roles.auth-decorator";
import {USER_ROLE} from "../../common/consts";
import {SupportRequestClientService} from "./services/support-request-client.service";
import {SupportRequestEmployeeService} from './services/support-request-employee.service'
import {SupportRequestService} from './services/support-request.service'
import {AuthenticatedGuard} from "../auth/guards/authenticated.guard";
import {RolesGuard} from "../auth/guards/roles.guard";

@Controller()
export class SupportRequestApiController {
  constructor(
    private readonly supportRequestService: SupportRequestService,
    private readonly supportRequestClientService: SupportRequestClientService,
    private readonly supportRequestEmployeeService: SupportRequestEmployeeService,
  ) {}

  @Get('common/support-requests/:id/messages')
  @Roles(USER_ROLE.CLIENT, USER_ROLE.MANAGER)
  async getSupportRequestsMessages(@Param('id') id: string) {
    return await this.supportRequestService.getMessages(id);
  }

  @Post('common/support-requests/:id/messages')
  @Roles(USER_ROLE.CLIENT, USER_ROLE.MANAGER)
  async sendMessage(
      @Param('id') id: string,
      @Request() req,
      @Body() body: CreateSupportRequestMessageParams,
  ) {
    const user = req.user;

    return await this.supportRequestService.sendMessage({
      supportRequest: id,
      ...body,
      author: user._id,
    });
  }

  @Roles(USER_ROLE.CLIENT)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Post('client/support-requests')
  async createSupportRequest(
    @Body() body: CreateSupportRequestParams,
    @Request() req,
  ) {
    const user = req.user;

    return await this.supportRequestClientService.createSupportRequest({
      ...body,
      user: user._id,
    });
  }

  @Roles(USER_ROLE.CLIENT)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('client/support-requests')
  async getClientSupportRequests(
    @Request() req,
    @Query() params: GetSupportRequestsQueryParams,
  ) {
    const user = req.user;

    return await this.supportRequestService.findSupportRequests({
      ...params,
      user: user._id,
    });
  }

  @Roles(USER_ROLE.MANAGER)
  @UseGuards(AuthenticatedGuard, RolesGuard)
  @Get('manager/support-requests')
  async getSupportRequests(@Query() params: GetSupportRequestsQueryParams) {
    return await this.supportRequestService.findSupportRequests({
      ...params,
    });
  }

  @Post('common/support-requests/:id/messages/read')
  @Roles(USER_ROLE.CLIENT, USER_ROLE.MANAGER)
  async markRead(
    @Param('id') supportRequest: string,
    @Request() req,
    @Body() body: MarkAsReadParams,
  ) {
    const user = req.user;

    const params = {
      supportRequest,
      createdBefore: new Date(body.createdBefore),
    };

    if (user.role == USER_ROLE.MANAGER) {
      return await this.supportRequestEmployeeService.markMessagesAsRead(
        params,
      );
    } else if (user.role == USER_ROLE.CLIENT) {
      const supportRequestDocument =
        await this.supportRequestService.findSupportRequestById(supportRequest);
      const userMatch =
        supportRequestDocument.get('user').toString() != user._id.toString();

      if (userMatch) {
        throw new ForbiddenException('Forbidden');
      }

      return await this.supportRequestClientService.markMessagesAsRead({
        ...params,
        user: user._id,
      });
    }
  }
}
