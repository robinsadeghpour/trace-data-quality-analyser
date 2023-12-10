import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { IDataSourceClientService } from './data-source.service';
import { TraceDataAnalysisService } from '../trace-data-analysis/trace-data-analysis.service';

@Injectable()
export class DataSourceWorker {
  private logger = new Logger('DataSourceWorker');

  public constructor(
    @Inject(IDataSourceClientService)
    private readonly dataSourceClient: IDataSourceClientService,
    @Inject(TraceDataAnalysisService)
    private readonly traceDataAnalysisService: TraceDataAnalysisService
  ) {}

  @Cron('5 * * * * *')
  public async fetchCurrentTraceData(): Promise<void> {
    this.logger.log('[fetchCurrentTraceData] Fetching trace data...');
    const traces = await this.dataSourceClient.fetchTraceData();

    this.traceDataAnalysisService.runTraceDataAnalysis(traces);
  }
}
