import { Injectable, Logger } from '@nestjs/common';
import { TraceDataAnalysis } from '@tdqa/types';
import { InjectRepository } from '@nestjs/typeorm';
import { TraceDataAnalysisEntity } from '../trace-data-analysis.entity';
import { MongoRepository } from 'typeorm';

export interface ThresholdOverrun {
  metric: keyof TraceDataAnalysis;
  percentageChange: number;
}

@Injectable()
export class ThresholdService {
  @InjectRepository(TraceDataAnalysisEntity)
  private readonly repository: MongoRepository<TraceDataAnalysisEntity>;

  private logger = new Logger('ThresholdService');
  private readonly THRESHOLD = 0.001;

  public async checkThresholds(
    newData: Partial<TraceDataAnalysis>
  ): Promise<ThresholdOverrun[]> {
    const previousData = await this.repository.findOne({
      order: { timestamp: 'DESC' },
    });

    const thresholdOverruns: ThresholdOverrun[] = [];

    if (!previousData) {
      return thresholdOverruns;
    }

    for (const metric in newData) {
      this.logger.log('[checkThresholds] Checking metric', metric);

      if (newData[metric] && previousData[metric]) {
        const newValue = newData[metric].avgScore
          ? newData[metric].avgScore
          : newData[metric];
        const previousValue = previousData[metric].avgScore
          ? previousData[metric].avgScore
          : previousData[metric];

        if (previousValue !== 0) {
          // Avoid division by zero
          const percentageChange =
            ((newValue - previousValue) / previousValue) * 100;

          if (Math.abs(percentageChange) > this.THRESHOLD) {
            this.logger.log(
              '[checkThresholds] Threshold exceeded for ',
              metric,
              'by',
              `${percentageChange.toFixed(2)}%`
            );
            thresholdOverruns.push({
              metric: metric as keyof TraceDataAnalysis,
              percentageChange: parseFloat(percentageChange.toFixed(2)),
            });
          }
        }
      }
    }

    return thresholdOverruns;
  }
}
