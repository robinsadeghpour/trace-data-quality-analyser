import React, { ReactElement, useMemo } from 'react';
import { MetricGaugeChart } from './MetricGaugeChart';
import { Box, HStack, Text } from '@chakra-ui/react';

export const ServiceInstrumentationCoverage = ({
  totalNumberOfServices,
  data,
}: {
  totalNumberOfServices: number;
  data: Record<string, number>;
}): ReactElement => {
  const numberOfServices = useMemo(() => {
    return Object.keys(data).length;
  }, [data]);

  return (
    <Box>
      <MetricGaugeChart
        title={'Instrumentation Coverage'}
        percentValue={(numberOfServices / totalNumberOfServices) * 100}
        descriptiveValues={[numberOfServices, totalNumberOfServices]}
      />
    </Box>
  );
};
