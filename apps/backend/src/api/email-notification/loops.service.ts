import { Injectable, Inject } from '@nestjs/common';
import axios from 'axios';
import { env } from '../../env';
import { IEmailNotificationService } from './email-notification.service';
import { ThresholdOverrun } from '../trace-data-analysis/threshold-service';
import { UserEmailService } from '../user-email/user-email.service';
import { TransactionalMailsEnum } from '@tdqa/types';

@Injectable()
export class LoopsService implements IEmailNotificationService {
  @Inject(UserEmailService)
  private readonly userEmailService: UserEmailService;

  public async sendThresholdOverrunEmail(
    thresholdOverruns: ThresholdOverrun[]
  ): Promise<void> {
    const emails = await this.userEmailService.getUserEmails();

    emails.forEach((email) => {
      this.sendTransactional(
        TransactionalMailsEnum.THRESHOLD_EMAIL,
        email.email,
        { thresholdOverruns: JSON.stringify(thresholdOverruns) }
      );
    });
  }

  private sendTransactional = async (
    transactionalMail: TransactionalMailsEnum,
    recipient: string,
    dataVariables?: Record<string, string | number>
  ): Promise<void> => {
    const options = {
      method: 'POST',
      headers: {
        Authorization: env.LOOPS_API_KEY,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        email: recipient,
        transactionalId: transactionalMail,
        dataVariables: dataVariables,
      }),
      url: 'https://app.loops.so/api/v1/transactional',
    };

    try {
      const response = await axios(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
}
