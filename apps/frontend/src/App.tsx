import { Box, Grid, ListItem, UnorderedList, VStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import isArray from 'lodash/isArray';
import { Route, Routes } from 'react-router-dom';
import { useNotification } from './hooks/useNotification';
import NotFoundPage from './pages/notfound';
import { routes } from './routes';
import { getErrorMessage } from './services/api.service';
import { ResponseError } from '@tdqa/types';
import Header from './components/Header';

const App = (): JSX.Element => {
  const queryClient = useQueryClient();
  queryClient.setDefaultOptions({
    queries: {
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (error) => {
        const message = getErrorMessage(error);
        const messages = isArray(message) ? message : [message];

        notification({
          title: (error as AxiosError<ResponseError>).response?.status || 500,
          status: 'error',
          description: (
            <UnorderedList>
              {messages.map((msg) => (
                <ListItem key={msg}>{msg}</ListItem>
              ))}
            </UnorderedList>
          ),
        });
      },
    },
  });

  const notification = useNotification();

  return (
    <Grid
      gridTemplateColumns={{ md: `1fr` }}
      width="100vw"
      height={'100vh'}
      backgroundColor="gray.100"
    >
      <Box width="100vw" backgroundColor="gray.100" paddingBottom={8}>
        <VStack gap={8} width="100vw">
          <Header />
          <Routes>
            {routes.map(({ path, component }) => (
              <Route path={path} element={component} key={`route-${path}`} />
            ))}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </VStack>
      </Box>
    </Grid>
  );
};

export default App;
