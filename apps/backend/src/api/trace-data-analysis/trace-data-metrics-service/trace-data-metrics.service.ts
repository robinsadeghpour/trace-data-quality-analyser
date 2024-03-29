import { Injectable, Logger } from '@nestjs/common';
import { Trace, TraceScore, TraceScores } from '@tdqa/types';

@Injectable()
export class TraceDataMetricsService {
  private logger = new Logger('TraceDataService');

  public calculateInfrequentEventOrdering(traces: Trace[]): TraceScores {
    let totalScore = 0;
    const traceScores: TraceScore[] = [];

    traces.forEach((trace) => {
      const spanMap = trace.spans.reduce((map, span) => {
        map[span.spanId] = span;

        return map;
      }, {});

      const hasAnomaly = trace.spans.some((span) => {
        const parentSpan = span.parentSpanId
          ? spanMap[span.parentSpanId]
          : null;

        return parentSpan?.timestamp >= span.timestamp;
      });

      const scoreForThisTrace = +hasAnomaly; // 1 if true (anomaly), 0 if false
      totalScore += scoreForThisTrace;
      traceScores.push({ traceId: trace.id, score: scoreForThisTrace });
    });

    const avgScore = this.calculateAverageScore(totalScore, traces.length);

    return {
      avgScore: avgScore,
      scores: traceScores,
    };
  }

  public calculateFutureEntry(traces: Trace[]): number {
    let futureEntryCount = 0;
    const currentTime = Date.now();

    traces.forEach((trace) => {
      trace.spans.forEach((span) => {
        if (span.timestamp.getTime() >= currentTime) {
          futureEntryCount++;
        }
      });
    });

    return futureEntryCount;
  }

  public calculateDuplicatesWithinTrace(traces: Trace[]): number {
    let detectedDuplicates = 0;
    let affectedTraces = 0;

    traces.forEach((trace) => {
      const spanMap = new Map<string, number>();

      trace.spans.forEach((span) => {
        const key = `${span.timestamp.getTime()}-${span.endTimestamp.getTime()}`;
        const count = (spanMap.get(key) || 0) + 1;
        spanMap.set(key, count);

        if (count === 2) {
          detectedDuplicates++;
          affectedTraces++;
        }
      });
    });

    const totalSpans = traces.reduce(
      (sum, trace) => sum + trace.spans.length,
      0
    );
    const totalTraceIds = traces.length;

    const score = Math.pow(
      1 -
        detectedDuplicates / (2 * totalSpans) -
        affectedTraces / (2 * totalTraceIds),
      4
    );

    return Math.max(score, 0);
  }

  public calculateSTC(traces: Trace[]): TraceScores {
    let totalSTC = 0;
    const scores: TraceScore[] = [];

    traces.forEach((trace) => {
      const stc = this.calculateSTCForSingleTrace(trace);
      scores.push({ traceId: trace.id, score: stc });
      totalSTC += stc;
    });

    return {
      avgScore: this.calculateAverageScore(totalSTC, traces.length),
      scores: scores,
    };
  }

  public calculateSTCPS(traces: Trace[]): Record<string, number> {
    this.logger.log('[calculateSTCPS] calculate STCPS:');

    const serviceScores: Record<string, number> = {};
    let totalTraces = 0;

    traces.forEach((trace) => {
      const serviceCoverage = this.calculateSTCPSForSingleTrace(trace);
      // this.logger.log('[calculateSTCPS] serviceCoverage', serviceCoverage);
      Object.entries(serviceCoverage).forEach(([serviceName, coverage]) => {
        if (!serviceScores[serviceName]) {
          serviceScores[serviceName] = 0;
        }

        serviceScores[serviceName] += coverage;
      });
      totalTraces++;
    });

    // Calculate average score for each service
    Object.keys(serviceScores).forEach((service) => {
      serviceScores[service] = serviceScores[service] / totalTraces;
    });

    this.logger.log('[calculateSTCPS] Final Service Scores:', serviceScores);

    return serviceScores;
  }

  public calculateMissingActivity(traces: Trace[]): number {
    let totalAffectedSpans = 0;
    let totalSpans = 0;

    traces.forEach((trace) => {
      let affectedSpans = 0;

      trace.spans.forEach((span) => {
        if (!span.timestamp || !span.endTimestamp) {
          affectedSpans++;
        }
      });

      totalAffectedSpans += affectedSpans;
      totalSpans += trace.spans.length;
    });

    return Math.pow(1 - totalAffectedSpans / (2 * totalSpans), 4);
  }

  public calculateMissingProperties(traces: Trace[]): TraceScores {
    const requiredProperties = [
      'traceId',
      'spanId',
      'parentSpanId',
      'timestamp',
      'endTimestamp',
      'name',
    ];
    let totalMissingProperties = 0;
    const scores: TraceScore[] = [];

    traces.forEach((trace) => {
      let missingPropertiesForTrace = 0;
      trace.spans.forEach((span) => {
        requiredProperties.forEach((prop) => {
          if (!span[prop]) {
            missingPropertiesForTrace++;
          }
        });
      });
      totalMissingProperties += missingPropertiesForTrace;
      const ratioForTrace =
        missingPropertiesForTrace / requiredProperties.length;
      scores.push({ traceId: trace.id, score: Math.pow(1 - ratioForTrace, 2) });
    });

    const totalRequiredProperties =
      requiredProperties.length *
      traces.reduce((acc, trace) => acc + trace.spans.length, 0);
    const ratioOfMissingProperties =
      totalMissingProperties / totalRequiredProperties;

    return {
      avgScore: Math.pow(1 - ratioOfMissingProperties, 2),
      scores: scores,
    };
  }

  public calculateTraceDepth(traces: Trace[]): TraceScores {
    const scores: TraceScore[] = [];

    traces.forEach((trace) => {
      let maxDepth = 0;
      const depthMap = new Map<string, number>();
      let minStartTime = Number.MAX_SAFE_INTEGER;
      let maxEndTime = Number.MIN_SAFE_INTEGER;

      trace.spans.forEach((span) => {
        const startTime = new Date(span.timestamp).getTime();
        const endTime = new Date(span.endTimestamp).getTime();
        minStartTime = Math.min(minStartTime, startTime);
        maxEndTime = Math.max(maxEndTime, endTime);

        const parentDepth = span.parentSpanId
          ? depthMap.get(span.parentSpanId) || 0
          : 0;
        const currentDepth = parentDepth + 1;
        depthMap.set(span.spanId, currentDepth);
        maxDepth = Math.max(maxDepth, currentDepth);
      });

      const totalDuration = maxEndTime - minStartTime;
      const weightedScore = maxDepth * totalDuration;

      scores.push({ traceId: trace.id, score: weightedScore });
    });

    const avgDepth =
      scores.reduce((acc, curr) => acc + curr.score, 0) / traces.length;

    return {
      avgScore: avgDepth,
      scores: scores,
    };
  }

  public calculateTraceBreadth(traces: Trace[]): TraceScores {
    const scores: TraceScore[] = [];
    traces.forEach((trace) => {
      const uniqueServices = new Set<string>();
      trace.spans.forEach((span) => {
        uniqueServices.add(span.resource.service.name);
      });

      scores.push({ traceId: trace.id, score: uniqueServices.size });
    });

    const avgBreadth =
      scores.reduce((acc, curr) => acc + curr.score, 0) / traces.length;

    return {
      avgScore: avgBreadth,
      scores: scores,
    };
  }

  private calculateSTCPSForSingleTrace(trace: Trace): Record<string, number> {
    // Check if there's only one span in the trace
    if (trace.spans.length === 1) {
      const singleSpan = trace.spans[0];
      const service = singleSpan.resource.service.name;

      return { [service]: 100 }; // The single span covers the entire trace duration
    }

    const rootSpan =
      trace.spans.find((span) => !span.parentSpanId) ?? trace.spans[0];
    const rootSpanStart = rootSpan.timestamp.getTime();
    const rootSpanEnd = rootSpan.endTimestamp.getTime();
    const rootSpanDuration = rootSpanEnd - rootSpanStart || 1;

    if (rootSpanDuration === 0) {
      // this.logger.warn(
      //   'Root span duration is zero, which may lead to incorrect STCPS calculation.'
      // );

      return {};
    }

    const serviceDurations: Record<string, number> = {};

    trace.spans.forEach((span) => {
      if (span.spanId !== rootSpan.spanId) {
        const service = span.resource.service.name;
        const spanStart = Math.max(span.timestamp.getTime(), rootSpanStart);
        const spanEnd = Math.min(span.endTimestamp.getTime(), rootSpanEnd);
        const spanDuration = Math.max(0, spanEnd - spanStart);

        serviceDurations[service] =
          (serviceDurations[service] || 0) + spanDuration;
      }
    });

    // Convert durations to percentages for each service
    Object.keys(serviceDurations).forEach((service) => {
      serviceDurations[service] =
        (serviceDurations[service] / rootSpanDuration) * 100;
    });

    return serviceDurations;
  }

  private calculateSTCForSingleTrace(trace: Trace): number {
    const rootSpan =
      trace.spans.find((span) => !span.parentSpanId) ?? trace.spans[0];

    if (trace.spans.length === 1) {
      return 100;
    }

    const rootSpanStart = rootSpan.timestamp.getTime();
    const rootSpanEnd = rootSpan.endTimestamp.getTime();
    let rootSpanDuration = rootSpanEnd - rootSpanStart;
    rootSpanDuration = rootSpanDuration || 1;

    const childSpansDuration = trace.spans.reduce((duration, span) => {
      if (span.spanId !== rootSpan.spanId) {
        const spanStart = Math.max(span.timestamp.getTime(), rootSpanStart);
        const spanEnd = Math.min(span.endTimestamp.getTime(), rootSpanEnd);
        const overlapDuration = Math.max(0, spanEnd - spanStart);

        return duration + overlapDuration;
      }

      return duration;
    }, 0);

    const STC = (childSpansDuration / rootSpanDuration) * 100;

    if (STC > 100) {
      // this.logger.warn(
      //   `[calculateSTC] STC exceeds 100% for trace ${trace.id}. This might be due to overlapping spans or incorrect timestamps.`
      // );
    }

    return STC;
  }

  private calculateAverageScore(
    totalScore: number,
    numberOfTraces: number
  ): number {
    return totalScore / numberOfTraces;
  }
}
