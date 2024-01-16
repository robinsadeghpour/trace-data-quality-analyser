import React, { ReactElement } from 'react';
import GaugeChart from 'react-gauge-chart';
import { VStack, Text, theme } from '@chakra-ui/react';

interface Props {
  title: string;
  percentValue: number;
}

export const MetricGaugeChart = ({
  title,
  percentValue,
}: Props): ReactElement => {
  return (
    <VStack
      height={'full'}
      width={'full'}
      borderRadius={'xl'}
      bgColor={'gray.800'}
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
    </VStack>
  );
};
