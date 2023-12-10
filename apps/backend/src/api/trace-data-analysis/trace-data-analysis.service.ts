import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, MongoRepository } from 'typeorm';
import { TraceDataAnalysisEntity } from './trace-data-analysis.entity';
import { Trace, TraceDataAnalysis } from '@tdqa/types';
import { ObjectId } from 'mongodb';
import { Index } from './trace-data-metrics-service';

@Injectable()
export class TraceDataAnalysisService {
  @InjectRepository(TraceDataAnalysisEntity)
  private readonly repository: MongoRepository<TraceDataAnalysisEntity>;

  @Inject(Index)
  private readonly traceDataMetricsService: Index;

  private logger = new Logger('TraceDataAnalysisService');
  private readonly THRESHOLD = 0.1;

  public async runTraceDataAnalysis(traceData: Trace[]): Promise<void> {
    this.logger.log('[runTraceDataAnalysis] Analyzing trace data...');

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
      precision: this.traceDataMetricsService.calculatePrecision(traceData),
      missingActivity:
        this.traceDataMetricsService.calculateMissingActivity(traceData),
      missingProperties:
        this.traceDataMetricsService.calculateMissingProperties(traceData),
    };

    this.logger.log(
      '[runTraceDataAnalysis] Trace Data Analysis done:',
      traceDataAnalysis
    );

    const traceDataAnalysisEntity = this.repository.create(traceDataAnalysis);
    this.repository.save(traceDataAnalysisEntity);
  }

  public async getTraceDataAnalysis(): Promise<TraceDataAnalysis[]> {
    return this.repository.find({
      select: [
        '_id',
        'created_at',
        'updated_at',
        'timestamp',
        'duplicatesWithinTrace.avgScore',
        'format.avgScore',
        'infrequentEventOrdering.avgScore',
        'missingActivity.avgScore',
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

  private async checkThresholds(
    newData: Partial<TraceDataAnalysis>
  ): Promise<void> {
    const previousData = await this.repository.findOne({
      order: { timestamp: 'DESC' },
    });

    if (!previousData) {
      return;
    }

    for (const metric in newData) {
      if (newData[metric] && previousData[metric]) {
        const difference = Math.abs(
          newData[metric].avgScore - previousData[metric].avgScore
        );

        if (difference > this.THRESHOLD) {
          this.logger.log(
            '[checkThresholds] threshold exceeded for ',
            metric,
            'by',
            difference
          );
          // TODO notify user
          // TODO: Add code to display in frontend
        }
      }
    }
  }
}
