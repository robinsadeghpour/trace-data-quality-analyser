import { Module } from '@nestjs/common';
import { LoopsService } from './loops.service';
import { UserEmailModule } from '../user-email/user-email.module';
import { EmailNotificationController } from './email-notification.controller';
import { IEmailNotificationService } from './email-notification.service';

@Module({
  imports: [UserEmailModule],
  controllers: [EmailNotificationController],
  providers: [{ provide: IEmailNotificationService, useClass: LoopsService }],
  exports: [IEmailNotificationService],
})
export class EmailNotificationModule {}
