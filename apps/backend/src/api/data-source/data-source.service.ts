import { Trace } from '@tdqa/types';

export interface IDataSourceClientService {
  fetchTraceData(): Promise<Trace[]>;
}

export const IDataSourceClientService = Symbol('IDataSourceClientService');
