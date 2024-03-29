import { ObjectId } from 'typeorm';
import {RequestBody} from "./types";

export interface ResponseError {
  statusCode: number;
  error: string;
  message?: string[];
}

export interface Document {
  _id: ObjectId;
  created_at: Date;
  updated_at: Date;
}

export interface Trace {
  id: string;
  spans: Span[];
}

export interface Span {
  timestamp: Date;
  endTimestamp: Date;
  kind: string;
  link: string[];
  name: string;
  parentSpanId?: string;
  spanId: string;
  traceId: string;
  traceStatus: number;
  resource: Resource;
  attributes: object;
}

export interface Resource {
  container?: {
    id?: string;
  };
  host?: {
    arch?: string;
    name?: string;
  };
  os?: {
    description?: string;
    name?: string;
    type?: string;
    version?: string;
  };
  process?: {
    command?: string;
    commandArgs?: string[];
    commandLine?: string;
    executable?: {
      name?: string;
      path?: string;
    };
    owner?: string;
    pid?: number;
    runtime: {
      description?: string;
      name: string;
      version: string;
    };
  };
  service: {
    instance?: {
      id?: string;
    };
    name: string;
    namespace?: string;
  };
  telemetry?: {
    auto?: {
      version?: string;
    };
    sdk: {
      language: string;
      name: string;
      version: string;
    };
  };
}

export interface TraceDataAnalysis extends Document {
  timestamp: Date;
  spanTimeCoverage?: TraceScores;
  spanTimeCoveragePerService?: Record<string, number>;
  futureEntry?: number;
  infrequentEventOrdering?: TraceScores;
  precision?: TraceScores;
  traceDepth?: TraceScores;
  traceBreadth?: TraceScores;
  // Completeness
  missingActivity?: number;
  missingProperties?: TraceScores;
  // Consistency
  mixedGranulartiyOfTraces?: TraceScores;
  format?: TraceScores;
  timestampFormat?: TraceScores;
  // Uniqueness
  duplicatesWithinTrace?: number;
  instrumentationCoverage?: number;
}

export interface TraceScores {
  avgScore: number;
  serviceName?: string;
  scores: TraceScore[];
}

export interface TraceScore {
  traceId: string;
  score: number;
  serviceName?: string;
}

export interface UserEmail extends Document {
  email: string;
}

export interface Settings {
  emais: UserEmail[];
  threshold: number;
}

export interface DockerComposeService {
  serviceName: string;
  containerName: string;
  exposedPorts: string[];
  hostnames?: string;
}

export interface DockerComposeAnalysis {
  serviceCount: number;
  services: DockerComposeService[];
}

export interface MetricChanges {
  metric: keyof TraceDataAnalysis;
  percentageChange: number;
}
