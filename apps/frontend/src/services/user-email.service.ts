import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';
import { DeleteResult } from 'typeorm';
import request, { RequestError } from './api.service';
import { RequestBody, UserEmail } from '@tdqa/types';
import { useNotification } from '../hooks/useNotification';

export const useUserMails = (): UseQueryResult<UserEmail[]> =>
  useQuery(['userMail'], () => request<UserEmail[]>('/setting/user-mail'));

export const useAddUserMail = (): UseMutationResult<
  UserEmail,
  RequestError,
  RequestBody<UserEmail>
> => {
  const notification = useNotification();
  const queryClient = useQueryClient();

  return useMutation(
    ['userMail', 'add'],
    (data) =>
      request<UserEmail>('/setting/user-mail', { method: 'POST', data }),
    {
      onSuccess: ({ email }) => {
        queryClient.invalidateQueries(['userMail'], { exact: true });
        notification({
          status: 'success',
          description: `${email} successfully created`,
        });
      },
    }
  );
};

export const useDeleteUserMail = (): UseMutationResult<
  DeleteResult,
  RequestError,
  string
> => {
  const queryClient = useQueryClient();

  return useMutation(
    ['userMail', 'delete'],
    (userMailId: string) =>
      request<DeleteResult>(`/setting/user-mail/${userMailId}`, {
        method: 'DELETE',
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userMail'], { exact: true });
      },
    }
  );
};
