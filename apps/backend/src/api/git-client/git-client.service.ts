
import {DockerComposeAnalysis, MetricChanges} from '@tdqa/types';

export interface IGitClientService {
  createThresholdOverrunIssue(thresholdOveruns: MetricChanges[]): void;
  getServiceInfosFromRepoFile(): Promise<DockerComposeAnalysis>;
}

export const IGitClientService = Symbol('IGitClientService');
