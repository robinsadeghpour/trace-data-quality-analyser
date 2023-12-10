import { Grid } from '@chakra-ui/react';
import { useTraceDataAnalysis } from '../services/trace-data-analysis.service';
import LineChart from '../components/Chart/LineChart';
import { TraceDataAnalysis, TraceScores } from '@tdqa/types';

const traceDataProperties: { key: string; title: string }[] = [
  { key: 'spanTimeCoverage', title: 'Span Time Coverage' },
  { key: 'futureEntry', title: 'Future Entry' },
  { key: 'infrequentEventOrdering', title: 'Infrequent Event Ordering' },
  { key: 'precision', title: 'Precision' },
  { key: 'traceDepth', title: 'Trace Depth' },
  { key: 'traceBreadth', title: 'Trace Breadth' },
  { key: 'missingActivity', title: 'Missing Activity' },
  { key: 'missingProperties', title: 'Missing Properties' },
  { key: 'mixedGranulartiyOfTraces', title: 'Mixed Granularity Of Traces' },
  { key: 'format', title: 'Format' },
  { key: 'timestampFormat', title: 'Timestamp Format' },
  { key: 'duplicatesWithinTrace', title: 'Duplicates Within Trace' },
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
