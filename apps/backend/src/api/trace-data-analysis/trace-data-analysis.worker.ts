import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TraceDataAnalysisService } from './trace-data-analysis.service';
import { ThresholdService } from './threshold-service';
import { IDataSourceClientService } from '../data-source/data-source.service';
import { IEmailNotificationService } from '../email-notification/email-notification.service';
import { IGitClientService } from '../git-client/git-client.service';

@Injectable()
export class TraceDataAnalysisWorker {
  private logger = new Logger('TraceDataAnalysisWorker');

  public constructor(
    @Inject(IDataSourceClientService)
    private readonly dataSourceClient: IDataSourceClientService,
    @Inject(TraceDataAnalysisService)
    private readonly traceDataAnalysisService: TraceDataAnalysisService,
    @Inject(ThresholdService)
    private readonly thresholdService: ThresholdService,
    @Inject(IEmailNotificationService)
    private readonly emailNotificationService: IEmailNotificationService,
    @Inject(IGitClientService)
    private readonly gitClientService: IGitClientService
  ) {}

  @Cron('0 * * * *')
  public async runTraceDataAnalysisJob(): Promise<void> {
    this.logger.log('[runTraceDataAnalysisJob] Analyzing trace data...');
      this.traceDataAnalysisService.runTraceDataAnalysis()
  }
}
