import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from '../../app/error.dto';

import { UserEmailDto } from './user-email.dto';
import { UserEmailService } from './user-email.service';
import { UserEmail } from '@tdqa/types';
import { DeleteResult } from 'typeorm';

@ApiTags('settings')
@Controller('settings')
export class UserEmailController {
  public constructor(private readonly settingService: UserEmailService) {}

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiOkResponse({ type: UserEmailDto, isArray: true })
  public async getUserMails(): Promise<UserEmail[]> {
    return this.settingService.getUserEmails();
  }

  @Post()
  @ApiOperation({ summary: 'Create a user-email' })
  @ApiCreatedResponse({ type: UserEmailDto })
  @ApiBadRequestResponse({ type: ErrorDto })
  public async createUserMail(@Body() body: UserEmailDto): Promise<UserEmail> {
    return this.settingService.createUserEmail(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user-email by id' })
  @ApiOkResponse({ type: DeleteResult })
  @ApiNotFoundResponse({ type: ErrorDto })
  public async deleteUserMailById(
    @Param('id') id: string
  ): Promise<DeleteResult> {
    return this.settingService.deleteUserEmailById(id);
  }
}
