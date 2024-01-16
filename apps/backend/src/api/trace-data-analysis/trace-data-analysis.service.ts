import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MongoRepository } from 'typeorm';
import { TraceDataAnalysisEntity } from './trace-data-analysis.entity';
import { Trace, TraceDataAnalysis } from '@tdqa/types';
import { ObjectId } from 'mongodb';
import { TraceDataMetricsService } from './trace-data-metrics-service/trace-data-metrics.service';
import { IDataSourceClientService } from '../data-source/data-source.service';
import { ThresholdService } from './threshold-service';
import { IEmailNotificationService } from '../email-notification/email-notification.service';
import { IGitClientService } from '../git-client/git-client.service';

@Injectable()
export class TraceDataAnalysisService {
  @InjectRepository(TraceDataAnalysisEntity)
  private readonly repository: MongoRepository<TraceDataAnalysisEntity>;

  @Inject(TraceDataMetricsService)
  private readonly traceDataMetricsService: TraceDataMetricsService;

  private logger = new Logger('TraceDataAnalysisService');

  public constructor(
    @Inject(IDataSourceClientService)
    private readonly dataSourceClient: IDataSourceClientService,
    @Inject(ThresholdService)
    private readonly thresholdService: ThresholdService,
    @Inject(IEmailNotificationService)
    private readonly emailNotificationService: IEmailNotificationService,
    @Inject(IGitClientService)
    private readonly gitClientService: IGitClientService
  ) {}

  public async runTraceDataAnalysis(): Promise<TraceDataAnalysis> {
    this.logger.log('[runTraceDataAnalysis] Analyzing trace data...');

    this.logger.log('[runTraceDataAnalysis] Fetching trace data...');
    const traceData = await this.dataSourceClient.fetchTraceData();

    this.logger.log(
      `[runTraceDataAnalysis] Fetched ${traceData.length} traces, starting analysis...`
    );
    const traceDataAnalysis = await this.createTraceDataAnalysis(traceData);

    this.logger.log(
      `[runTraceDataAnalysis] Analysis finished, checking thresholds...`
    );
    const threshHoldOverruns =
      await this.thresholdService.checkThresholds(traceDataAnalysis);

    if (threshHoldOverruns.length) {
      this.logger.log(
        '[runTraceDataAnalysis] Thresholds exceeded, sending email and creating GitHub issue...'
      );
      this.emailNotificationService.sendThresholdOverrunEmail(
        threshHoldOverruns
      );
      this.gitClientService.createThresholdOverrunIssue(threshHoldOverruns);
    } else {
      this.logger.log('[runTraceDataAnalysis] No thresholds exceeded.');
    }

    this.logger.log('[runTraceDataAnalysis] Done!');

    return traceDataAnalysis;
  }

  public async getTraceDataAnalysis(): Promise<TraceDataAnalysis[]> {
    return this.repository.find({
      select: [
        '_id',
        'created_at',
        'updated_at',
        'timestamp',
        'duplicatesWithinTrace',
        'format.avgScore',
        'infrequentEventOrdering.avgScore',
        'missingActivity',
        'missingProperties.avgScore',
        'mixedGranulartiyOfTraces.avgScore',
        'precision.avgScore',
        'spanTimeCoverage.avgScore',
        'spanTimeCoveragePerService',
        'timestampFormat.avgScore',
        'traceBreadth.avgScore',
        'traceDepth.avgScore',
        'futureEntry',
      ],
    });
  }

  public async getTraceDataAnalysisById(
    _id: string,
    select?: string[]
  ): Promise<TraceDataAnalysis> {
    const traceDataAnalysis = await this.repository.findOne({
      where: { _id: new ObjectId(_id) },
      select: [
        '_id',
        'created_at',
        'updated_at',
        'timestamp',
        ...(select as unknown as (keyof TraceDataAnalysis)[]),
      ],
    });

    if (!traceDataAnalysis) {
      throw new NotFoundException([
        `TraceDataAnalysis with id ${_id} not found`,
      ]);
    }

    return traceDataAnalysis;
  }

  public async deleteTraceDataAnalysisById(id: string): Promise<DeleteResult> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new NotFoundException([
        `TraceDataAnalysis with id ${id} not found`,
      ]);
    }

    return result;
  }

  private createTraceDataAnalysis(
    traceData: Trace[]
  ): Promise<TraceDataAnalysisEntity> {
    const traceDataAnalysis: Partial<TraceDataAnalysis> = {
      timestamp: new Date(),
      spanTimeCoverage: this.traceDataMetricsService.calculateSTC(traceData),
      spanTimeCoveragePerService:
        this.traceDataMetricsService.calculateSTCPS(traceData),
      futureEntry: this.traceDataMetricsService.calculateFutureEntry(traceData),
      duplicatesWithinTrace:
        this.traceDataMetricsService.calculateDuplicatesWithinTrace(traceData),
      infrequentEventOrdering:
        this.traceDataMetricsService.calculateInfrequentEventOrdering(
          traceData
        ),
      missingActivity:
        this.traceDataMetricsService.calculateMissingActivity(traceData),
      missingProperties:
        this.traceDataMetricsService.calculateMissingProperties(traceData),
      traceBreadth:
        this.traceDataMetricsService.calculateTraceBreadth(traceData),
      traceDepth: this.traceDataMetricsService.calculateTraceDepth(traceData),
    };

    this.logger.log('[runTraceDataAnalysis] Trace Data Analysis done');

    const traceDataAnalysisEntity = this.repository.create(traceDataAnalysis);

    return this.repository.save(traceDataAnalysisEntity);
  }
}
