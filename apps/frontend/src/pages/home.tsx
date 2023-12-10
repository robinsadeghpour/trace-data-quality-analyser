import { Grid } from '@chakra-ui/react';
import { useTraceDataAnalysis } from '../services/trace-data-analysis.service';
import LineChart from '../components/Chart/LineChart';
import { TraceDataAnalysis, TraceScores } from '@tdqa/types';

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
  // TODO
  // { key: 'traceDepth', title: 'Trace Depth', isClickable: true },
  // { key: 'traceBreadth', title: 'Trace Breadth', isClickable: true },
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
];

function instanceOfTraceScores(object: any): object is TraceScores {
  return typeof object === 'object' && object !== null && 'avgScore' in object;
}

const HomePage = (): JSX.Element => {
  const { data } = useTraceDataAnalysis();

  return (
    <Grid
      rowGap={12}
      columnGap={8}
      width={'full'}
      paddingX={8}
      templateColumns="repeat(2, 1fr)"
      gap={4}
    >
      {traceDataProperties.map((prop) => (
        <LineChart
          key={Math.random()}
          title={prop.title}
          metric={prop.key as keyof TraceDataAnalysis}
          isClickable={prop.isClickable}
          data={
            data?.map((analysis) => {
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
