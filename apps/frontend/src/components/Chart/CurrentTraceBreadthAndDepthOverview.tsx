import React, { ReactElement } from 'react';
import { HStack, VStack, Text, Heading } from '@chakra-ui/react';
import { DockerComposeAnalysis } from '@tdqa/types';

const CurrentTraceBreadthAndDepthOverview = ({
  serviceInfos,
  traceBreadth,
  traceDepth,
}: {
  serviceInfos: DockerComposeAnalysis;
  traceBreadth: number;
  traceDepth: number;
}): ReactElement => {
  // Round to two decimal places
  const roundedTraceBreadth = traceBreadth.toFixed(2);
  const roundedTraceDepth = traceDepth.toFixed(2);

  return (
    <VStack gap={6}>
      <Text fontWeight={'bold'}>
        Current Trace Breadth and Trace Depth Overview
      </Text>
      <HStack gap={8}>
        <VStack>
          <Heading>{serviceInfos.serviceCount}</Heading>
          <Text>Service Count</Text>
        </VStack>
        <VStack>
          <Heading>{roundedTraceBreadth}</Heading>
          <Text>Avg Trace Breadth</Text>
        </VStack>
        <VStack>
          <Heading>{roundedTraceDepth}</Heading>
          <Text>Avg Trace Depth</Text>
        </VStack>
      </HStack>
    </VStack>
  );
};

export default CurrentTraceBreadthAndDepthOverview;
