import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IDataSourceClientService } from './data-source.service';
import { TraceDataAnalysisService } from '../trace-data-analysis/trace-data-analysis.service';
import { ThresholdService } from '../trace-data-analysis/threshold-service';
import { IEmailNotificationService } from '../trace-data-analysis/email-notification.service';

@Injectable()
export class DataSourceWorker {
  private logger = new Logger('DataSourceWorker');

  public constructor(
    @Inject(IDataSourceClientService)
    private readonly dataSourceClient: IDataSourceClientService,
    @Inject(TraceDataAnalysisService)
    private readonly traceDataAnalysisService: TraceDataAnalysisService,
    @Inject(ThresholdService)
    private readonly thresholdService: ThresholdService,
    @Inject(IEmailNotificationService)
    private readonly emailNotificationService: IEmailNotificationService
  ) {}

  @Cron('5 * * * * *')
  public async fetchCurrentTraceData(): Promise<void> {
    this.logger.log('[fetchCurrentTraceData] Fetching trace data...');
    const traces = await this.dataSourceClient.fetchTraceData();

    const traceDataAnalysis =
      await this.traceDataAnalysisService.runTraceDataAnalysis(traces);

    const threashHoldOverruns =
      await this.thresholdService.checkThresholds(traceDataAnalysis);

    if (threashHoldOverruns.length) {
      this.emailNotificationService.sendThresholdOverrunEmail(
        threashHoldOverruns
      );
    }
  }
}
