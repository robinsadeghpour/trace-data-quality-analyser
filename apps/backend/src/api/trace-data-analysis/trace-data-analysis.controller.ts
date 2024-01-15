import {
  Controller,
  Delete,
  Get,
  Param,
  ParseArrayPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorDto } from '../../app/error.dto';

import { TraceDataAnalysisDto } from './trace-data-analysis.dto';
import { TraceDataAnalysisService } from './trace-data-analysis.service';
import { MetricChanges, TraceDataAnalysis } from '@tdqa/types';
import { DeleteResult } from 'typeorm';
import { ThresholdService } from './threshold-service';

@ApiTags('analysis')
@Controller('trace-data/analysis')
export class TraceDataAnalysisController {
  public constructor(
    private readonly traceDataAnalysisService: TraceDataAnalysisService,
    private readonly thresholdService: ThresholdService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all trace-data-analysis' })
  @ApiOkResponse({ type: TraceDataAnalysisDto, isArray: true })
  @ApiQuery({
    name: 'select',
    required: false,
    description: 'Return related objects',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filter by status',
  })
  public async getTraceDataAnalysis(): Promise<TraceDataAnalysis[]> {
    return this.traceDataAnalysisService.getTraceDataAnalysis();
  }

  @Get('/changes')
  @ApiOperation({ summary: 'Get latest trace-data-analysis changes' })
  @ApiOkResponse({ type: Object, isArray: true })
  public async getTraceDataAnalysisChanges(): Promise<MetricChanges[]> {
    return this.thresholdService.calculateMetricChanges();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a trace-data-analysis by id' })
  @ApiOkResponse({ type: DeleteResult })
  @ApiNotFoundResponse({ type: ErrorDto })
  public async deleteTraceDataAnalysisById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<DeleteResult> {
    return this.traceDataAnalysisService.deleteTraceDataAnalysisById(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a trace-data-analysis by id' })
  @ApiOkResponse({ type: TraceDataAnalysisDto })
  @ApiNotFoundResponse({ type: ErrorDto })
  public async getTraceDataAnalysisById(
    @Param('id') id: string,
    @Query(
      'select',
      new ParseArrayPipe({ items: String, separator: ',', optional: true })
    )
    select?: string[]
  ): Promise<TraceDataAnalysis> {
    return this.traceDataAnalysisService.getTraceDataAnalysisById(id, select);
  }
}
