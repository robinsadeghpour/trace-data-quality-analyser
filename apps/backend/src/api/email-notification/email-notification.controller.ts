import { Controller, Inject, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from '../../app/error.dto';
import { IEmailNotificationService } from './email-notification.service';

@ApiTags('emailNotification')
@Controller('emailNotification')
export class EmailNotificationController {
  public constructor(
    @Inject(IEmailNotificationService)
    private readonly emailNotificationService: IEmailNotificationService
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Send Email',
    description: 'This endpoint is for testing purposes only',
  })
  @ApiOkResponse()
  @ApiBadRequestResponse({ type: ErrorDto })
  public async createUserMail(): Promise<void> {
    this.emailNotificationService.sendThresholdOverrunEmail([
      { metric: 'futureEntry', percentageChange: 50 },
    ]);
  }
}
