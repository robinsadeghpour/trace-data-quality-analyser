import { MetricChanges } from '@tdqa/types';

export interface IEmailNotificationService {
  sendThresholdOverrunEmail(thresholdOveruns: MetricChanges[]): Promise<void>;
}

export const IEmailNotificationService = Symbol('IEmailNotificationService');
