import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TraceDataAnalysisService } from '../trace-data-analysis/trace-data-analysis.service';
import { ThresholdService } from '../trace-data-analysis/threshold-service';
import { IDataSourceClientService } from './data-source.service';
import { IEmailNotificationService } from '../email-notification/email-notification.service';
import { IGitClientService } from '../git-client/git-client.service';

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
    private readonly emailNotificationService: IEmailNotificationService,
    @Inject(IGitClientService)
    private readonly gitClientService: IGitClientService
  ) {}

  @Cron('55 * * * * *')
  public async fetchCurrentTraceData(): Promise<void> {
    this.logger.log('[fetchCurrentTraceData] Fetching trace data...');
    const traces = await this.dataSourceClient.fetchTraceData();

    this.logger.log(
      `[fetchCurrentTraceData] Fetched ${traces.length} traces, starting analysis...`
    );
    const traceDataAnalysis =
      await this.traceDataAnalysisService.runTraceDataAnalysis(traces);

    this.logger.log(
      `[fetchCurrentTraceData] Analysis finished, checking thresholds...`
    );
    const threshHoldOverruns =
      await this.thresholdService.checkThresholds(traceDataAnalysis);

    if (threshHoldOverruns.length) {
      this.logger.log(
        '[fetchCurrentTraceData] Thresholds exceeded, sending email and creating GitHub issue...'
      );
      this.emailNotificationService.sendThresholdOverrunEmail(
        threshHoldOverruns
      );
      this.gitClientService.createThresholdOverrunIssue(threshHoldOverruns);
    } else {
      this.logger.log('[fetchCurrentTraceData] No thresholds exceeded.');
    }

    this.logger.log('[fetchCurrentTraceData] Done!');
  }
}
