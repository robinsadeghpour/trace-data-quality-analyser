import { Box, HStack, VStack } from '@chakra-ui/react';
import {
  useServiceInfos,
  useTraceDataAnalysis,
  useTraceDataAnalysisChanges,
} from '../services/trace-data-analysis.service';
import LineChart from '../components/Chart/LineChart';
import { TraceDataAnalysis, TraceScores } from '@tdqa/types';
import CurrentTraceBreadthAndDepthOverview from '../components/Chart/CurrentTraceBreadthAndDepthOverview';
import { ReactElement } from 'react';
import MetricChangesTable from '../components/Chart/MetricChangesTable';
import ServiceInformation from '../components/Chart/ServiceInformation';
import MetricCard, { metricKeys } from '../components/Chart/MetricCard';
import { MetricGaugeChart } from '../components/Chart/MetricGaugeChart';
import { MetricPieChart } from '../components/Chart/MetricPieChart';

const traceDataProperties: {
  key: string;
  title: string;
  isClickable: boolean;
}[] = [
  { key: 'spanTimeCoverage', title: 'Span Time Coverage', isClickable: true },
  { key: 'futureEntry', title: 'Future Entry', isClickable: false },
  {
    key: 'infrequentEventOrdering',
    title: 'Infrequent Event Ordering',
    isClickable: true,
  },
  // { key: 'precision', title: 'Precision', isClickable: true },
  { key: 'missingActivity', title: 'Missing Activity', isClickable: false },
  { key: 'missingProperties', title: 'Missing Properties', isClickable: true },
  {
    key: 'mixedGranulartiyOfTraces',
    title: 'Mixed Granularity Of Traces',
    isClickable: true,
  },
  {
    key: 'duplicatesWithinTrace',
    title: 'Duplicates Within Trace',
    isClickable: false,
  },
  {
    key: 'traceBreadth',
    title: 'Trace Breadth',
    isClickable: true,
  },
  {
    key: 'traceDepth',
    title: 'Trace Breadth',
    isClickable: true,
  },
];

function instanceOfTraceScores(object: any): object is TraceScores {
  return typeof object === 'object' && object !== null && 'avgScore' in object;
}

const HomePage = (): ReactElement => {
  const { data: traceDataAnalysis } = useTraceDataAnalysis();
  const { data: serviceInfos } = useServiceInfos();
  const { data: metricChanges } = useTraceDataAnalysisChanges();

  const sortedTraceDataAnalysis = [...(traceDataAnalysis ?? [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const currentTraceBreadth =
    sortedTraceDataAnalysis?.[0]?.traceBreadth?.avgScore ?? 0;
  const currentTraceDepth =
    sortedTraceDataAnalysis?.[0]?.traceDepth?.avgScore ?? 0;

  return (
    <Box px={16}>
      <HStack wrap={'wrap'} width={'full'} gap={4}>
        <Box flex={1} width={['1/5']} height={'full'}>
          <MetricGaugeChart
            title={'Avg Span Time Coverage'}
            percentValue={
              traceDataAnalysis?.[0].spanTimeCoverage?.avgScore ?? 0
            }
          />
        </Box>
        <Box flex={1} width={['1/5']} height={'full'}>
          <MetricPieChart
            title={'Span Time Coverage per Service'}
            data={traceDataAnalysis?.[0].spanTimeCoveragePerService ?? {}}
          />
        </Box>
        {traceDataProperties
          .filter((prop) => prop.key !== 'spanTimeCoverage')
          .map((prop) => (
            <Box height={'full'} width={['1/5']} flex={1}>
              <MetricCard
                key={Math.random()}
                title={prop.title}
                metric={prop.key as metricKeys}
                isClickable={prop.isClickable}
                data={
                  traceDataAnalysis?.map((analysis) => {
                    const property =
                      analysis[prop.key as keyof typeof analysis];
                    const value = instanceOfTraceScores(property)
                      ? property.avgScore
                      : typeof property === 'number'
                      ? property
                      : 0;

                    return {
                      date: analysis.timestamp,
                      value,
                      _id: analysis._id.toString(),
                    };
                  }) ?? []
                }
              />
            </Box>
          ))}
      </HStack>
      <HStack
        mt={8}
        wrap={'wrap'}
        gap={8}
        width={'full'}
        justifyContent={'space-evenly'}
      >
        {serviceInfos && metricChanges && (
          <>
            <VStack height={'100%'} gap={12} justifyContent={'space-evenly'}>
              <MetricChangesTable metricChanges={metricChanges} />
              <CurrentTraceBreadthAndDepthOverview
                traceBreadth={currentTraceBreadth}
                traceDepth={currentTraceDepth}
                serviceInfos={serviceInfos}
              />
            </VStack>
            <ServiceInformation serviceInfos={serviceInfos} />
          </>
        )}
        {traceDataProperties.map((prop) => (
          <Box w={['full', '49%']}>
            <LineChart
              key={Math.random()}
              title={prop.title}
              metric={prop.key as keyof TraceDataAnalysis as metricKeys}
              isClickable={prop.isClickable}
              data={
                traceDataAnalysis?.map((analysis) => {
                  const property = analysis[prop.key as keyof typeof analysis];
                  const value = instanceOfTraceScores(property)
                    ? property.avgScore
                    : typeof property === 'number'
                    ? property
                    : 0;

                  return {
                    date: analysis.timestamp,
                    value,
                    _id: analysis._id.toString(),
                  };
                }) ?? []
              }
            />
          </Box>
        ))}
      </HStack>
    </Box>
  );
};

export default HomePage;
