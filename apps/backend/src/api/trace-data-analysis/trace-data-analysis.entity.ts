import { Column, Entity } from 'typeorm';
import { DocumentEntity } from '../../database/document.entity';
import { TraceDataAnalysis, TraceScores } from '@tdqa/types';

@Entity('data-source-analysis-report')
export class TraceDataAnalysisEntity
  extends DocumentEntity
  implements TraceDataAnalysis
{
  @Column()
  public duplicatesWithinTrace: TraceScores;

  @Column()
  public format: TraceScores;

  @Column()
  public futureEntry: number;

  @Column()
  public infrequentEventOrdering: TraceScores;

  @Column()
  public missingActivity: TraceScores;

  @Column()
  public missingProperties: TraceScores;

  @Column()
  public mixedGranulartiyOfTraces: TraceScores;

  @Column()
  public precision: TraceScores;

  @Column()
  public spanTimeCoverage: TraceScores;

  @Column()
  public timestamp: Date;

  @Column()
  public timestampFormat: TraceScores;

  @Column()
  public traceBreadth: TraceScores;

  @Column()
  public traceDepth: TraceScores;
}
