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
import { TraceDataAnalysis } from '@tdqa/types';
import { DeleteResult } from 'typeorm';

@ApiTags('analysis')
@Controller('data-source/analysis')
export class TraceDataAnalysisController {
  public constructor(
    private readonly traceDataAnalysisService: TraceDataAnalysisService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all data-source-analysis' })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a data-source-analysis by id' })
  @ApiOkResponse({ type: DeleteResult })
  @ApiNotFoundResponse({ type: ErrorDto })
  public async deleteTraceDataAnalysisById(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<DeleteResult> {
    return this.traceDataAnalysisService.deleteTraceDataAnalysisById(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a data-source-analysis by id' })
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
