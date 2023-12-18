import { ThresholdOverrun } from '../trace-data-analysis/threshold-service';

export interface IEmailNotificationService {
  sendThresholdOverrunEmail(
    thresholdOveruns: ThresholdOverrun[]
  ): Promise<void>;
}

export const IEmailNotificationService = Symbol('IEmailNotificationService');
