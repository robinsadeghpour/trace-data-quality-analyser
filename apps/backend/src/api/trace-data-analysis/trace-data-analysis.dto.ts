import { TraceDataAnalysis, TraceScores } from '@tdqa/types';
import { DocumentDto } from '../../database/document.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class TraceDataAnalysisDto
  extends DocumentDto
  implements TraceDataAnalysis
{
  @ApiPropertyOptional({ type: () => Number })
  public duplicatesWithinTrace?: number;

  @ApiPropertyOptional({ type: () => Object })
  public format: TraceScores;

  @ApiPropertyOptional({ type: () => Number })
  public futureEntry: number;

  @ApiPropertyOptional({ type: () => Object })
  public infrequentEventOrdering: TraceScores;

  @ApiPropertyOptional({ type: () => Number })
  public missingActivity: number;

  @ApiPropertyOptional({ type: () => Object })
  public missingProperties: TraceScores;

  @ApiPropertyOptional({ type: () => Object })
  public mixedGranulartiyOfTraces: TraceScores;

  @ApiPropertyOptional({ type: () => Object })
  public precision: TraceScores;

  @ApiPropertyOptional({ type: () => Object })
  public spanTimeCoverage: TraceScores;

  @ApiPropertyOptional({ type: () => Date })
  public timestamp: Date;

  @ApiPropertyOptional({ type: () => Object })
  public timestampFormat: TraceScores;

  @ApiPropertyOptional({ type: () => Object })
  public traceBreadth: TraceScores;

  @ApiPropertyOptional({ type: () => Object })
  public traceDepth: TraceScores;
}
