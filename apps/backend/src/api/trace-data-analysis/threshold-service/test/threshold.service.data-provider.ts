import { MetricChanges, TraceDataAnalysis } from '@tdqa/types';

export interface ThresholdServiceDataProvider {
  prev: Partial<TraceDataAnalysis>;
  curr: Partial<TraceDataAnalysis>;
  expectedResult: MetricChanges[];
}

export const thresholdDataProvider: ThresholdServiceDataProvider[] = [
  {
    // Test case where the futureEntry increases by 50%
    prev: {
      futureEntry: 10,
    },
    curr: {
      futureEntry: 15,
    },
    expectedResult: [{ metric: 'futureEntry', percentageChange: 0.5 }],
  },
  {
    // Test case where the futureEntry decreases by more than the threshold
    prev: {
      futureEntry: 20,
    },
    curr: {
      futureEntry: 10,
    },
    expectedResult: [{ metric: 'futureEntry', percentageChange: -0.5 }],
  },
  {
    // Test case where there is a significant change meeting the threshold
    prev: {
      futureEntry: 10,
    },
    curr: {
      futureEntry: 11,
    },
    expectedResult: [{ metric: 'futureEntry', percentageChange: 0.1 }],
  },
  {
    // Test case with multiple metrics, one exceeding threshold and one not
    prev: {
      futureEntry: 10,
      spanTimeCoverage: { avgScore: 0.8, scores: [] },
    },
    curr: {
      futureEntry: 12,
      spanTimeCoverage: { avgScore: 0.82, scores: [] },
    },
    expectedResult: [
      { metric: 'futureEntry', percentageChange: 0.2 },
      // spanTimeCoverage change is not significant enough
    ],
  },
  {
    // Test case where previous data has a metric value of zero
    prev: {
      futureEntry: 0,
    },
    curr: {
      futureEntry: 5,
    },
    expectedResult: [
      // Can't calculate percentage change due to division by zero
    ],
  },
];
