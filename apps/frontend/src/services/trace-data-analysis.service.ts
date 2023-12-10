import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { DeleteResult } from 'typeorm';
import request, { RequestError } from './api.service';
import { TraceDataAnalysis } from '@tdqa/types';

type TraceDataAnalysisSelect = keyof TraceDataAnalysis;

export interface TraceDataAnalysisQuery {
  select?: TraceDataAnalysisSelect[];
}

export const useTraceDataAnalysis = (): UseQueryResult<TraceDataAnalysis[]> =>
  useQuery(['traceDataAnalysis'], () =>
    request<TraceDataAnalysis[]>('trace-data/analysis')
  );

export const useDeleteTraceDataAnalysis = (): UseMutationResult<
  DeleteResult,
  RequestError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation(
    ['traceDataAnalysiss', 'delete'],
    (traceDataAnalysisId: string) =>
      request<DeleteResult>(`/trace-data/analysis/${traceDataAnalysisId}`, {
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['traceDataAnalysis'], { exact: true });
      },
    }
  );
};

export const useTraceDataAnalysisById = (
  id?: string,
  params?: TraceDataAnalysisQuery
): UseQueryResult<TraceDataAnalysis> => {
  return useQuery(['traceDataAnalysis', id], () =>
    request<TraceDataAnalysis>(`/trace-data/analysis/${id}`, { params })
  );
};
