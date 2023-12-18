import { Module } from '@nestjs/common';
import { ElasticsearchDataSourceService } from './elasticsearch-data-source.service';
import { TraceDataAnalysisModule } from '../trace-data-analysis/trace-data-analysis.module';
import { EmailNotificationModule } from '../email-notification/email-notification.module';
import { GitClientModule } from '../git-client/git-client.module';
import { DataSourceWorker } from './data-source.worker';
import { IDataSourceClientService } from './data-source.service';

@Module({
  imports: [TraceDataAnalysisModule, EmailNotificationModule, GitClientModule],
  controllers: [],
  providers: [
    {
      provide: IDataSourceClientService,
      useClass: ElasticsearchDataSourceService,
    },
    DataSourceWorker,
  ],
  exports: [],
})
export class DataSourceModule {}
