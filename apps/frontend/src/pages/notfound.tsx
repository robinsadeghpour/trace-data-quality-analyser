import { Flex, Heading } from '@chakra-ui/react';

const NotFoundPage = (): JSX.Element => {
  return (
    <Flex
      height="full"
      alignItems="center"
      flexDirection="column"
      paddingTop="20"
    >
      <Heading size="lg">404 | Page Not Found</Heading>
    </Flex>
  );
};

export default NotFoundPage;
