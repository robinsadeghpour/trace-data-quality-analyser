import { Module } from '@nestjs/common';
import { ElasticsearchDataSourceService } from './elasticsearch-data-source.service';
import { TraceDataAnalysisModule } from '../trace-data-analysis/trace-data-analysis.module';

@Module({
  imports: [TraceDataAnalysisModule],
  controllers: [],
  providers: [ElasticsearchDataSourceService],
  exports: [],
})
export class DataSourceModule {}
