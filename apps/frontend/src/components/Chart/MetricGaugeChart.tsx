import React, { ReactElement } from 'react';
import GaugeChart from 'react-gauge-chart';
import { VStack, Text, theme, HStack } from '@chakra-ui/react';

interface Props {
  title: string;
  percentValue: number;
  descriptiveValues?: number[];
}

export const MetricGaugeChart = ({
  title,
  percentValue,
  descriptiveValues,
}: Props): ReactElement => {
  return (
    <VStack
      height={'full'}
      width={'full'}
      borderRadius={'xl'}
      bgColor={'gray.800'}
      p={4}
    >
      <Text>{title}</Text>
      <GaugeChart
        id={title}
        percent={percentValue / 100}
        colors={[
          theme.colors.red['500'],
          theme.colors.orange['500'],
          theme.colors.green['500'],
        ]}
      />
      {descriptiveValues && descriptiveValues.length === 2 && (
        <HStack width={'full'} justifyContent={'center'}>
          <Text fontWeight={'bold'}>
            {descriptiveValues?.[0]} / {descriptiveValues?.[1]}
          </Text>
        </HStack>
      )}
    </VStack>
  );
};
