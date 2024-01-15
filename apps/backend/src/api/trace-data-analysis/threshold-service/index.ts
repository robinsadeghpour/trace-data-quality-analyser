import { Injectable, Logger } from '@nestjs/common';
import { MetricChanges, RequestBody, TraceDataAnalysis } from '@tdqa/types';
import { InjectRepository } from '@nestjs/typeorm';
import { TraceDataAnalysisEntity } from '../trace-data-analysis.entity';
import { MongoRepository } from 'typeorm';

@Injectable()
export class ThresholdService {
  @InjectRepository(TraceDataAnalysisEntity)
  private readonly repository: MongoRepository<TraceDataAnalysisEntity>;

  private logger = new Logger('ThresholdService');
  private readonly THRESHOLD = 0.1;

  public async calculateMetricChanges(): Promise<MetricChanges[]> {
    const lastTwoData = await this.repository.find({
      order: { timestamp: 'DESC' },
      take: 2,
    });

    if (lastTwoData.length < 2) {
      return [];
    }

    const [newData, previousData] = lastTwoData;

    return this.calculateChanges(newData, previousData);
  }

  public async checkThresholds(
    newData: Partial<RequestBody<TraceDataAnalysis>>
  ): Promise<MetricChanges[]> {
    const previousData = await this.repository.findOne({
      order: { timestamp: 'DESC' },
    });

    if (!previousData) {
      return [];
    }

    const changes = this.calculateChanges(newData, previousData);

    return changes.filter(
      (change) => Math.abs(change.percentageChange) >= this.THRESHOLD
    );
  }

  private calculateChanges(
    newData: Partial<TraceDataAnalysis>,
    previousData: TraceDataAnalysis
  ): MetricChanges[] {
    const changes: MetricChanges[] = [];

    for (const metric in newData) {
      if (
        !['_id', 'created_at', 'updated_at', 'timestamp'].includes(metric) &&
        newData[metric] &&
        previousData[metric]
      ) {
        const newValue = newData[metric].avgScore ?? newData[metric];
        const previousValue =
          previousData[metric].avgScore ?? previousData[metric];

        if (previousValue !== 0) {
          const percentageChange = (newValue - previousValue) / previousValue;
          changes.push({
            metric: metric as keyof TraceDataAnalysis,
            percentageChange: parseFloat(percentageChange.toFixed(2)),
          });
        }
      }
    }

    return changes;
  }
}
