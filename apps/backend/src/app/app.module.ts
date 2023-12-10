import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { TypeOrmConfigService } from '../database/typeorm.service';
import { LoggerMiddleware } from './logger.middleware';
import { DataSourceModule } from '../api/data-source/data-source.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TraceDataAnalysisModule } from '../api/trace-data-analysis/trace-data-analysis.module';
import { UserEmailModule } from '../api/user-email/user-email.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'frontend'),
      exclude: ['/api/(.*)'],
    }),
    ScheduleModule.forRoot(),
    DataSourceModule,
    TraceDataAnalysisModule,
    UserEmailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
