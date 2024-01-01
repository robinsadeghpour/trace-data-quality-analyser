import { Grid } from '@chakra-ui/react';
import {
  useServiceInfos,
  useTraceDataAnalysis,
} from '../services/trace-data-analysis.service';
import LineChart from '../components/Chart/LineChart';
import { TraceDataAnalysis, TraceScores } from '@tdqa/types';
import CurrentTraceBreadthAndDepthOverview from '../components/Chart/CurrentTraceBreadthAndDepthOverview';
import { ReactElement } from 'react';

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

  const sortedTraceDataAnalysis = [...(traceDataAnalysis ?? [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const currentTraceBreadth =
    sortedTraceDataAnalysis?.[0]?.traceBreadth?.avgScore ?? 0;
  const currentTraceDepth =
    sortedTraceDataAnalysis?.[0]?.traceDepth?.avgScore ?? 0;

  return (
    <Grid
      rowGap={12}
      columnGap={8}
      width={'full'}
      paddingX={8}
      templateColumns="repeat(2, 1fr)"
      gap={4}
    >
      {serviceInfos && (
        <CurrentTraceBreadthAndDepthOverview
          traceBreadth={currentTraceBreadth}
          traceDepth={currentTraceDepth}
          serviceInfos={serviceInfos}
        />
      )}
      {traceDataProperties.map((prop) => (
        <LineChart
          key={Math.random()}
          title={prop.title}
          metric={prop.key as keyof TraceDataAnalysis}
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
      ))}
    </Grid>
  );
};

export default HomePage;
