import { ToastId, useToast, UseToastOptions } from '@chakra-ui/react';
import startCase from 'lodash/startCase';

type NotificationOptions = Required<
  Pick<UseToastOptions, 'status' | 'description'>
> &
  Omit<UseToastOptions, 'status' | 'description'>;

export const useNotification = (
  props?: UseToastOptions
): ((options: NotificationOptions) => ToastId) => {
  const toast = useToast(props);

  return (options: NotificationOptions) => {
    const { title, position, ...props } = options;
    const status = startCase(props.status);

    return toast({
      title: title ? `${status} ${title}` : status,
      position: 'bottom-right',
      ...props,
    });
  };
};
