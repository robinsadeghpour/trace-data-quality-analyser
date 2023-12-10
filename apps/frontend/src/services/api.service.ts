import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { env } from '../env';
import { ResponseError } from '@tdqa/types';

export type RequestError = AxiosError<ResponseError>;

export function getErrorMessage(err: unknown): string | string[] {
  if (axios.isAxiosError(err)) {
    if (err.response?.data.message?.length) {
      return err.response.data.message;
    }

    return err.response?.data.error || err.message;
  }

  return 'Something went wrong!';
}

export const client = (() => axios.create({ baseURL: `${env.API_URL}/api` }))();

const request = async <T>(
  url: string,
  options?: AxiosRequestConfig
): Promise<T> =>
  client({ url, method: 'GET', withCredentials: true, ...options }).then(
    (response: AxiosResponse<T>) => response.data
  );

export default request;
