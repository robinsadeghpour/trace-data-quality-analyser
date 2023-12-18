import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceDataAnalysisEntity } from './trace-data-analysis.entity';
import { TraceDataAnalysisService } from './trace-data-analysis.service';
import { TraceDataAnalysisController } from './trace-data-analysis.controller';
import { TraceDataMetricsService } from './trace-data-metrics-service/trace-data-metrics.service';
import { ThresholdService } from './threshold-service';

@Module({
  imports: [TypeOrmModule.forFeature([TraceDataAnalysisEntity])],
  controllers: [TraceDataAnalysisController],
  providers: [
    TraceDataAnalysisService,
    TraceDataMetricsService,
    ThresholdService,
  ],
  exports: [TraceDataAnalysisService, ThresholdService],
})
export class TraceDataAnalysisModule {}
