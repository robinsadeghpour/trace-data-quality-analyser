import React, { ReactElement } from 'react';
import { VStack, Text, Box } from '@chakra-ui/react';
import LineChart, { LineChartProps } from './LineChart';
import { TraceDataAnalysis } from '@tdqa/types';

type Props = LineChartProps;

export type metricKeys = keyof Omit<
  TraceDataAnalysis,
  'timestamp' | 'created_at' | 'updated_at' | '_id'
>;

type OptimalValues = {
  [key in metricKeys]: number;
};

const optimalValues: Partial<OptimalValues> = {
  spanTimeCoverage: 100,
  futureEntry: 0,
  infrequentEventOrdering: 0,
  missingActivity: 0,
  missingProperties: 0,
  mixedGranulartiyOfTraces: 0,
  duplicatesWithinTrace: 0,
  traceBreadth: 1,
  traceDepth: 13,
};

const MetricCard = (props: Props): ReactElement => {
  const lastIndex = props.data.length ? props.data.length - 1 : 0;
  const latestValue = props.data[lastIndex]?.value ?? 0;
  const optimalValue = optimalValues[props.metric]!;

  let cardColor, lineColor;

  if (latestValue >= optimalValue * 0.7) {
    cardColor = 'green.900';
    lineColor = 'green';
  } else if (latestValue >= optimalValue * 0.4) {
    cardColor = 'orange.900';
    lineColor = 'orange';
  } else {
    cardColor = 'red.900';
    lineColor = 'red';
  }

  return (
    <VStack width={'full'} borderRadius={'xl'} bgColor={cardColor}>
      <div>{props.title}</div>
      <VStack justifyItems={'center'}>
        <Text fontSize={'xxx-large'} fontWeight={'bold'}>
          {latestValue?.toFixed(2)}
        </Text>
      </VStack>
      <Box padding={4}>
        <LineChart
          metric={props.metric}
          data={props.data}
          isClickable={false}
          showAxes={false}
          showGrid={false}
          showLabels={false}
          backgroundColor={'transparent'}
          lineColor={lineColor}
        />
      </Box>
    </VStack>
  );
};

export default MetricCard;
