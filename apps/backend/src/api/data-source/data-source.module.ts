import { Module } from '@nestjs/common';
import { ElasticsearchDataSourceService } from './elasticsearch-data-source.service';
import { IDataSourceClientService } from './data-source.service';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: IDataSourceClientService,
      useClass: ElasticsearchDataSourceService,
    },
  ],
  exports: [IDataSourceClientService],
})
export class DataSourceModule {}
