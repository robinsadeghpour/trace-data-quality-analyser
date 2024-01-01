import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MongoRepository } from 'typeorm';
import { TraceDataAnalysisEntity } from './trace-data-analysis.entity';
import { Trace, TraceDataAnalysis } from '@tdqa/types';
import { ObjectId } from 'mongodb';
import { TraceDataMetricsService } from './trace-data-metrics-service/trace-data-metrics.service';
import {Cron} from "@nestjs/schedule";

@Injectable()
export class TraceDataAnalysisService {
  @InjectRepository(TraceDataAnalysisEntity)
  private readonly repository: MongoRepository<TraceDataAnalysisEntity>;

  @Inject(TraceDataMetricsService)
  private readonly traceDataMetricsService: TraceDataMetricsService;

  private logger = new Logger('TraceDataAnalysisService');

  @Cron('55 * * * * *')
  public async createTraceDataAnalysis(
    traceData: Trace[]
  ): Promise<TraceDataAnalysis> {
    this.logger.log('[runTraceDataAnalysis] Analyzing trace data...');

    return this.createTraceDataAnalysis(traceData);
  }

  private createTraceDataAnalysis(traceData: Trace[]) {
    const traceDataAnalysis: Partial<TraceDataAnalysis> = {
      timestamp: new Date(),
      spanTimeCoverage: this.traceDataMetricsService.calculateSTC(traceData),
      futureEntry: this.traceDataMetricsService.calculateFutureEntry(traceData),
      duplicatesWithinTrace:
        this.traceDataMetricsService.calculateDuplicatesWithinTrace(traceData),
      infrequentEventOrdering:
        this.traceDataMetricsService.calculateInfrequentEventOrdering(
          traceData
        ),
      // precision: this.traceDataMetricsService.calculatePrecision(traceData),
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
}
