import React from 'react';
import { DockerComposeAnalysis } from '@tdqa/types';
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import theme from '../../theme';

const ServiceInformation = ({
  serviceInfos,
}: {
  serviceInfos: DockerComposeAnalysis;
}): React.ReactElement => {
  return (
    <VStack p={8} backgroundColor={theme.colors.gray[800]} borderRadius={'xl'}>
      <Text fontWeight={'bold'}>Service Information</Text>
      <Text fontWeight={'medium'}>
        Service Count: {serviceInfos.serviceCount}
      </Text>
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Services and their Container Names</TableCaption>
          <Thead>
            <Tr>
              <Th>Service Name</Th>
              <Th>Service Container</Th>
            </Tr>
          </Thead>
          <Tbody>
            {serviceInfos.services.map((s, i) => {
              return (
                <Tr key={i}>
                  <Td>{s.serviceName}</Td>
                  <Td>{s.containerName}</Td>
                  <Td>{s.hostnames}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
};

export default ServiceInformation;
