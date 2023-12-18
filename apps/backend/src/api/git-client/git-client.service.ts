import { ThresholdOverrun } from '../trace-data-analysis/threshold-service';
import {DockerComposeAnalysis} from "@tdqa/types";

export interface IGitClientService {
  createThresholdOverrunIssue(thresholdOveruns: ThresholdOverrun[]): void;
  getServiceInfosFromRepoFile(): Promise<DockerComposeAnalysis>;
}

export const IGitClientService = Symbol('IGitClientService');
