import { Inject, Injectable } from '@nestjs/common';
import { env } from '../../env';
import LoopsClient from 'loops';
import { IEmailNotificationService } from './email-notification.service';
import { ThresholdOverrun } from './threshold-service';
import { UserEmailService } from '../user-email/user-email.service';
import { TransactionalMailsEnum } from '@tdqa/types';

@Injectable()
export class LoopsEmailService implements IEmailNotificationService {
  @Inject(UserEmailService)
  private readonly userEmailService: UserEmailService;

  private readonly loopsClient: LoopsClient;

  public constructor() {
    this.loopsClient = new LoopsClient(env.LOOPS_API_KEY ?? '');
  }

  public async sendThresholdOverrunEmail(
    thresholdOveruns: ThresholdOverrun[]
  ): Promise<void> {
    const emails = await this.userEmailService.getUserEmails();

    emails.forEach((email) =>
      this.sendTransactional(
        TransactionalMailsEnum.THRESHOLD_EMAIL,
        email.email,
        { thresholdOveruns: JSON.stringify(thresholdOveruns) }
      )
    );
  }

  private sendTransactional = (
    transactionalMail: TransactionalMailsEnum,
    recipient: string,
    dataVariables?: Record<string, string | number>
  ): Promise<unknown> => {
    return this.loopsClient.sendTransactionalEmail(
      transactionalMail,
      recipient,
      dataVariables
    );
  };
}
