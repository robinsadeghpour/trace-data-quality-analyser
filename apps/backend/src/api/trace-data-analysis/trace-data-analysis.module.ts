import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TraceDataAnalysisEntity } from './trace-data-analysis.entity';
import { TraceDataAnalysisService } from './trace-data-analysis.service';
import { TraceDataAnalysisController } from './trace-data-analysis.controller';
import { Index } from './trace-data-metrics-service';

@Module({
  imports: [TypeOrmModule.forFeature([TraceDataAnalysisEntity])],
  controllers: [TraceDataAnalysisController],
  providers: [TraceDataAnalysisService, Index],
  exports: [TraceDataAnalysisService],
})
export class TraceDataAnalysisModule {}
