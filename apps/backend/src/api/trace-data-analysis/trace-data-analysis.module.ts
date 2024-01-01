import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceDataAnalysisEntity } from './trace-data-analysis.entity';
import { TraceDataAnalysisService } from './trace-data-analysis.service';
import { TraceDataAnalysisController } from './trace-data-analysis.controller';
import { TraceDataMetricsService } from './trace-data-metrics-service/trace-data-metrics.service';
import { ThresholdService } from './threshold-service';
import { TraceDataAnalysisWorker } from './trace-data-analysis.worker';
import { DataSourceModule } from '../data-source/data-source.module';
import { EmailNotificationModule } from '../email-notification/email-notification.module';
import { GitClientModule } from '../git-client/git-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TraceDataAnalysisEntity]),
    DataSourceModule,
    EmailNotificationModule,
    GitClientModule,
  ],
  controllers: [TraceDataAnalysisController],
  providers: [
    TraceDataAnalysisService,
    TraceDataMetricsService,
    ThresholdService,
    TraceDataAnalysisWorker,
  ],
  exports: [TraceDataAnalysisService, ThresholdService],
})
export class TraceDataAnalysisModule {}
