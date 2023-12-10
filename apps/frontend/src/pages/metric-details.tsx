import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTraceDataAnalysisById } from '../services/trace-data-analysis.service';
import { TraceDataAnalysis, TraceScores } from '@tdqa/types';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Button,
  VStack,
} from '@chakra-ui/react';

const MetricDetails = (): JSX.Element => {
  const navigate = useNavigate();

  const { _id, metric } = useParams<{ _id: string; metric: string }>();

  const { data } = useTraceDataAnalysisById(_id, {
    select: [metric as keyof TraceDataAnalysis],
  });

  const traceScores = data?.[metric as keyof TraceDataAnalysis] as
    | TraceScores
    | undefined;

  return (
    <VStack alignItems={'start'} justifyContent={'start'} gap={6}>
      <Heading as="h1" size="lg" marginY="4">
        {metric} - Average Score: {traceScores?.avgScore}
      </Heading>
      <Button onClick={() => navigate('/')} top="4" left="4">
        Back
      </Button>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Trace ID</Th>
            <Th>Score</Th>
          </Tr>
        </Thead>
        <Tbody>
          {traceScores?.scores.map((score, index) => (
            <Tr key={index}>
              <Td>{score.traceId}</Td>
              <Td>{score.score}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default MetricDetails;
