import React from 'react';
import { MetricChanges } from '@tdqa/types';
import {
  Box,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import theme from '../../theme';

const MetricChangesTable = ({
  metricChanges,
}: {
  metricChanges: MetricChanges[];
}) => {
  return (
    <Box
      height={'100%'}
      width={'100%'}
      p={8}
      backgroundColor={theme.colors.gray[800]}
      borderRadius={'xl'}
    >
      <TableContainer>
        <Table variant="simple">
          <TableCaption>Metric Value Change compared to Previous</TableCaption>
          <Thead>
            <Tr>
              <Th>Metric</Th>
              <Th>Change in Percent</Th>
            </Tr>
          </Thead>
          <Tbody>
            {metricChanges
              .filter(
                (m) =>
                  !['_id', 'created_at', 'updated_at', 'timestamp'].includes(
                    m.metric
                  )
              )
              .map((metricChange, i) => {
                return (
                  <Tr key={i}>
                    <Td>{metricChange.metric}</Td>
                    <Td
                      color={
                        Math.abs(metricChange.percentageChange) > 10
                          ? theme.colors.primary[500]
                          : 'white'
                      }
                    >
                      {metricChange.percentageChange}
                    </Td>
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MetricChangesTable;
