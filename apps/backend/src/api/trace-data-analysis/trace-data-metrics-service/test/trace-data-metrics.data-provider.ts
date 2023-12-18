import { Span } from '@tdqa/types';
import { addMilliseconds, subMilliseconds } from 'date-fns';

export interface TraceDataProvider {
  spans: Partial<Span>[];
  expectedScore: number;
  currentTime?: Date;
}

export const getInfrequentEventOrderingDataProvider =
  (): TraceDataProvider[] => {
    const timestamp = new Date();
    const timestamp2 = addMilliseconds(timestamp, 1);

    return [
      {
        spans: [
          { spanId: 'a', timestamp },
          {
            spanId: 'b',
            parentSpanId: 'a',
            timestamp: timestamp2,
          },
        ],
        expectedScore: 0,
      },
      {
        spans: [
          { spanId: 'a', timestamp: timestamp2 },
          {
            spanId: 'b',
            parentSpanId: 'a',
            timestamp,
          },
        ],
        expectedScore: 1,
      },
      {
        spans: [
          { spanId: 'a', timestamp },
          {
            spanId: 'b',
            parentSpanId: 'a',
            timestamp,
          },
        ],
        expectedScore: 1,
      },
    ];
  };

export const getFutureEntryDataProvider = (): TraceDataProvider[] => {
  const timestamp = new Date();
  const timestamp2 = addMilliseconds(timestamp, 1);
  const pastTimestamp = subMilliseconds(timestamp, 1);

  return [
    {
      // Span with a timestamp exactly at the current time
      currentTime: timestamp,
      spans: [{ spanId: 'a', timestamp }],
      expectedScore: 1,
    },
    {
      // Span with a timestamp in the past
      currentTime: timestamp,
      spans: [{ spanId: 'a', timestamp: pastTimestamp }],
      expectedScore: 0,
    },
    {
      // Span with a timestamp in the future
      currentTime: timestamp,
      spans: [{ spanId: 'a', timestamp: timestamp2 }],
      expectedScore: 1,
    },
    {
      // Span with a timestamp in the future, but the current time is in the past
      currentTime: pastTimestamp,
      spans: [{ spanId: 'a', timestamp: timestamp2 }],
      expectedScore: 1,
    },
    {
      // Two spans, one at current time and one in the future
      currentTime: timestamp,
      spans: [
        { spanId: 'a', timestamp },
        { spanId: 'b', timestamp: timestamp2 },
      ],
      expectedScore: 2,
    },
    {
      // Two spans, one at current time and one in the past
      currentTime: timestamp,
      spans: [
        { spanId: 'a', timestamp },
        { spanId: 'b', timestamp: pastTimestamp },
      ],
      expectedScore: 1,
    },
    {
      // Two spans, both in the future
      currentTime: timestamp,
      spans: [
        { spanId: 'a', timestamp: timestamp2 },
        { spanId: 'b', timestamp: timestamp2 },
      ],
      expectedScore: 2,
    },
    {
      // Span with a timestamp exactly at the current time (edge case)
      currentTime: timestamp,
      spans: [{ spanId: 'a', timestamp }],
      expectedScore: 1,
    },
    {
      // No spans provided
      currentTime: timestamp,
      spans: [],
      expectedScore: 0,
    },
  ];
};

export const getSpanTimeCoverageDataProvider = (): TraceDataProvider[] => {
  const baseTimestamp = new Date();

  return [
    {
      // Single span with no child spans
      spans: [
        {
          spanId: 'root',
          timestamp: baseTimestamp,
          endTimestamp: addMilliseconds(baseTimestamp, 100),
        },
      ],
      expectedScore: 100,
    },
    {
      // Root span with one direct child span
      spans: [
        {
          spanId: 'root',
          timestamp: baseTimestamp,
          endTimestamp: addMilliseconds(baseTimestamp, 200),
        },
        {
          spanId: 'child1',
          parentSpanId: 'root',
          timestamp: addMilliseconds(baseTimestamp, 50),
          endTimestamp: addMilliseconds(baseTimestamp, 150),
        },
      ],
      expectedScore: 50, // Child span covers 50% of the root span's duration
    },
    {
      // Root span with overlapping child spans
      spans: [
        {
          spanId: 'root',
          timestamp: baseTimestamp,
          endTimestamp: addMilliseconds(baseTimestamp, 200),
        },
        {
          spanId: 'child1',
          parentSpanId: 'root',
          timestamp: addMilliseconds(baseTimestamp, 50),
          endTimestamp: addMilliseconds(baseTimestamp, 150),
        },
        {
          spanId: 'child2',
          parentSpanId: 'root',
          timestamp: addMilliseconds(baseTimestamp, 100),
          endTimestamp: addMilliseconds(baseTimestamp, 200),
        },
      ],
      expectedScore: 100, // Overlapping child spans cover the entire duration of the root span
    },
    {
      // Root span with a child span that starts before the root span
      spans: [
        {
          spanId: 'root',
          timestamp: baseTimestamp,
          endTimestamp: addMilliseconds(baseTimestamp, 100),
        },
        {
          spanId: 'child1',
          parentSpanId: 'root',
          timestamp: subMilliseconds(baseTimestamp, 50),
          endTimestamp: addMilliseconds(baseTimestamp, 50),
        },
      ],
      expectedScore: 50, // Child span covers 50% of the root span's duration
    },
    {
      // Root span with a child span that ends after the root span
      spans: [
        {
          spanId: 'root',
          timestamp: baseTimestamp,
          endTimestamp: addMilliseconds(baseTimestamp, 100),
        },
        {
          spanId: 'child1',
          parentSpanId: 'root',
          timestamp: addMilliseconds(baseTimestamp, 50),
          endTimestamp: addMilliseconds(baseTimestamp, 150),
        },
      ],
      expectedScore: 50, // Child span covers 50% of the root span's duration
    },
    {
      // Multiple child spans with gaps
      spans: [
        {
          spanId: 'root',
          timestamp: baseTimestamp,
          endTimestamp: addMilliseconds(baseTimestamp, 200),
        },
        {
          spanId: 'child1',
          parentSpanId: 'root',
          timestamp: addMilliseconds(baseTimestamp, 50),
          endTimestamp: addMilliseconds(baseTimestamp, 100),
        },
        {
          spanId: 'child2',
          parentSpanId: 'root',
          timestamp: addMilliseconds(baseTimestamp, 150),
          endTimestamp: addMilliseconds(baseTimestamp, 200),
        },
      ],
      expectedScore: 50, // Child spans cover 50% of the root span's duration
    },
  ];
};

export const getMissingPropertiesDataProvider = (): TraceDataProvider[] => {
  return [
    {
      // All properties present
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          parentSpanId: 'parent1',
          timestamp: new Date(),
          endTimestamp: new Date(),
          name: 'spanName1',
        },
      ],
      expectedScore: 1, // No properties missing
    },
    {
      // One property missing
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          // parentSpanId is missing
          timestamp: new Date(),
          endTimestamp: new Date(),
          name: 'spanName1',
        },
      ],
      expectedScore: Math.pow(1 - 1 / 6, 2), // One property out of six is missing
    },
    {
      // Multiple properties missing in a single span
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          // parentSpanId, timestamp, and endTimestamp are missing
          name: 'spanName1',
        },
      ],
      expectedScore: Math.pow(1 - 3 / 6, 2), // Three properties out of six are missing
    },
    {
      // Properties missing across multiple spans
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          // parentSpanId is missing
          timestamp: new Date(),
          endTimestamp: new Date(),
          name: 'spanName1',
        },
        {
          traceId: 'trace1',
          spanId: 'span2',
          parentSpanId: 'span1',
          timestamp: new Date(),
          // endTimestamp and name are missing
        },
      ],
      expectedScore: Math.pow(1 - 3 / 12, 2), // Three properties out of twelve (6 per span) are missing
    },
    {
      // All properties missing in a single span
      spans: [
        {
          // All properties are missing
        },
      ],
      expectedScore: 0, // All properties missing, score is 0
    },
    {
      // Mix of complete and incomplete spans
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          parentSpanId: 'parent1',
          timestamp: new Date(),
          endTimestamp: new Date(),
          name: 'spanName1',
        },
        {
          // All properties are missing in this span
        },
      ],
      expectedScore: Math.pow(1 - 6 / 12, 2), // Six properties out of twelve are missing
    },
    // Additional test cases can be added as needed
  ];
};

export const getDuplicatesWithinTraceDataProvider = (): TraceDataProvider[] => {
  return [
    {
      // No duplicates
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          timestamp: new Date('2023-01-01T00:00:00Z'),
          endTimestamp: new Date('2023-01-01T00:01:00Z'),
        },
        {
          traceId: 'trace1',
          spanId: 'span2',
          timestamp: new Date('2023-01-01T00:02:00Z'),
          endTimestamp: new Date('2023-01-01T00:03:00Z'),
        },
      ],
      expectedScore: 1, // No duplicates, score is 1
    },
    {
      // One pair of duplicates
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          timestamp: new Date('2023-01-01T00:00:00Z'),
          endTimestamp: new Date('2023-01-01T00:01:00Z'),
        },
        {
          traceId: 'trace1',
          spanId: 'span2',
          timestamp: new Date('2023-01-01T00:00:00Z'),
          endTimestamp: new Date('2023-01-01T00:01:00Z'),
        },
      ],
      expectedScore: Math.pow(1 - 1 / (2 * 2) - 1 / 2, 4), // 1 detected duplicate, 1 affected trace, 2 total spans, 1 total trace
    },
    {
      // Multiple duplicates
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          timestamp: new Date('2023-01-01T00:00:00Z'),
          endTimestamp: new Date('2023-01-01T00:01:00Z'),
        },
        {
          traceId: 'trace1',
          spanId: 'span2',
          timestamp: new Date('2023-01-01T00:00:00Z'),
          endTimestamp: new Date('2023-01-01T00:01:00Z'),
        },
        {
          traceId: 'trace1',
          spanId: 'span3',
          timestamp: new Date('2023-01-01T00:02:00Z'),
          endTimestamp: new Date('2023-01-01T00:03:00Z'),
        },
        {
          traceId: 'trace1',
          spanId: 'span4',
          timestamp: new Date('2023-01-01T00:02:00Z'),
          endTimestamp: new Date('2023-01-01T00:03:00Z'),
        },
      ],
      expectedScore: Math.pow(1 - 2 / (2 * 4) - 1 / 2, 4), // 2 detected duplicates, 1 affected trace, 4 total spans, 1 total trace
    },
    {
      // Duplicates across multiple traces
      spans: [
        {
          traceId: 'trace1',
          spanId: 'span1',
          timestamp: new Date('2023-01-01T00:00:00Z'),
          endTimestamp: new Date('2023-01-01T00:01:00Z'),
        },
        {
          traceId: 'trace2',
          spanId: 'span2',
          timestamp: new Date('2023-01-01T00:00:00Z'),
          endTimestamp: new Date('2023-01-01T00:01:00Z'),
        },
      ],
      expectedScore: Math.pow(1 - 1 / (2 * 2) - 2 / (2 * 2), 4), // 1 detected duplicate, 2 affected traces, 2 total spans, 2 total traces
    },
  ];
};

export const getMissingActivityDataProvider = (): TraceDataProvider[] => {
  return [
    {
      // All spans have both start and end timestamps
      spans: [
        { spanId: 'span1', timestamp: new Date(), endTimestamp: new Date() },
        { spanId: 'span2', timestamp: new Date(), endTimestamp: new Date() },
      ],
      expectedScore: 1, // No missing activity, score is 1
    },
    {
      // One span missing start timestamp
      spans: [
        { spanId: 'span1', endTimestamp: new Date() },
        { spanId: 'span2', timestamp: new Date(), endTimestamp: new Date() },
      ],
      expectedScore: Math.pow(1 - 1 / (2 * 2), 4), // 1 affected span, 2 total spans
    },
    {
      // One span missing end timestamp
      spans: [
        { spanId: 'span1', timestamp: new Date() },
        { spanId: 'span2', timestamp: new Date(), endTimestamp: new Date() },
      ],
      expectedScore: Math.pow(1 - 1 / (2 * 2), 4), // 1 affected span, 2 total spans
    },
    {
      // Multiple spans missing timestamps
      spans: [
        { spanId: 'span1' },
        { spanId: 'span2', timestamp: new Date() },
        { spanId: 'span3', endTimestamp: new Date() },
        { spanId: 'span4', timestamp: new Date(), endTimestamp: new Date() },
      ],
      expectedScore: Math.pow(1 - 3 / (2 * 4), 4), // 3 affected spans, 4 total spans
    },
    {
      // All spans missing timestamps
      spans: [{ spanId: 'span1' }, { spanId: 'span2' }],
      expectedScore: Math.pow(1 - 2 / (2 * 2), 4),
    },
  ];
};

// export const getPrecisionDataProvider = () => {
//   return [
//     {
//       // span with millisecond precision
//       spans: [
//         { spanId: 'span1', timestamp: new Date('2023-01-01T00:00:00.123Z') },
//       ],
//       expectedScore: 1, // Highest precision, score is 1
//     },
//     {
//       // span with seconds precision
//       spans: [
//         { spanId: 'span1', timestamp: new Date('2023-01-01T00:00:12.00Z') },
//       ],
//       expectedScore: Math.pow(1 - 1 / 6, 2),
//     },
//     {
//       // All spans with minutes precision
//       spans: [
//         { spanId: 'span1', timestamp: new Date('2023-01-01T00:12:00.00Z') },
//       ],
//       expectedScore: Math.pow(1 - 2 / 6, 2), // Highest precision, score is 1
//     },
//     {
//       // All spans with hour precision
//       spans: [
//         { spanId: 'span1', timestamp: new Date('2023-01-01T23:00:00.00Z') },
//       ],
//       expectedScore: Math.pow(1 - 3 / 6, 2), // Highest precision, score is 1
//     },
//     // {
//     //   // All spans with millisecond precision
//     //   spans: [
//     //     { spanId: 'span1', timestamp: new Date('2023-01-01T00:00:00.123Z') },
//     //     { spanId: 'span2', timestamp: new Date('2023-01-01T00:00:00.456Z') },
//     //   ],
//     //   expectedScore: 1, // Highest precision, score is 1
//     // },
//     // {
//     //   // Spans with second and millisecond precision
//     //   spans: [
//     //     { spanId: 'span1', timestamp: new Date('2023-01-01T00:00:00Z') },
//     //     { spanId: 'span2', timestamp: new Date('2023-01-01T00:00:00.123Z') },
//     //   ],
//     //   expectedScore: Math.pow(1 - 1 / (6 * 2), 2), // One span with second precision, one with millisecond
//     // },
//     // {
//     //   // Spans with minute and second precision
//     //   spans: [
//     //     { spanId: 'span1', timestamp: new Date('2023-01-01T00:00Z') },
//     //     { spanId: 'span2', timestamp: new Date('2023-01-01T00:00:00Z') },
//     //   ],
//     //   expectedScore: Math.pow(1 - (2 + 1) / (6 * 2), 2), // One span with minute precision, one with second
//     // },
//     // {
//     //   // Spans with hour and day precision
//     //   spans: [
//     //     { spanId: 'span1', timestamp: new Date('2023-01-01T00Z') },
//     //     { spanId: 'span2', timestamp: new Date('2023-01-01') },
//     //   ],
//     //   expectedScore: Math.pow(1 - (3 + 4) / (6 * 2), 2), // One span with hour precision, one with day
//     // },
//     // {
//     //   // Spans with varying levels of precision
//     //   spans: [
//     //     { spanId: 'span1', timestamp: new Date('2023-01-01') },
//     //     { spanId: 'span2', timestamp: new Date('2023-01-01T00Z') },
//     //     { spanId: 'span3', timestamp: new Date('2023-01-01T00:00Z') },
//     //     { spanId: 'span4', timestamp: new Date('2023-01-01T00:00:00.123Z') },
//     //   ],
//     //   expectedScore: Math.pow(1 - (4 + 3 + 2 + 0) / (6 * 4), 2), // Spans with day, hour, second, and millisecond precision
//     // },
//   ];
// };

export const getTraceDepthDataProvider = (): TraceDataProvider[] => {
  return [
    {
      // Simple trace with no nested spans
      spans: [
        { spanId: 'a', timestamp: new Date() },
        { spanId: 'b', timestamp: new Date(), parentSpanId: 'a' },
      ],
      expectedScore: 2, // Depth of 2 (span 'a' and its child 'b')
    },
    {
      // Trace with multiple levels of nesting
      spans: [
        { spanId: 'a', timestamp: new Date() },
        { spanId: 'b', timestamp: new Date(), parentSpanId: 'a' },
        { spanId: 'c', timestamp: new Date(), parentSpanId: 'b' },
      ],
      expectedScore: 3, // Depth of 3 (span 'a', 'b', and 'c')
    },
    {
      // Trace with multiple branches but same maximum depth
      spans: [
        { spanId: 'a', timestamp: new Date() },
        { spanId: 'b', timestamp: new Date(), parentSpanId: 'a' },
        { spanId: 'c', timestamp: new Date(), parentSpanId: 'a' },
        { spanId: 'd', timestamp: new Date(), parentSpanId: 'b' },
      ],
      expectedScore: 3, // Depth of 3 (span 'a', 'b', and 'd')
    },
  ];
};

export const getTraceBreadthDataProvider = (): TraceDataProvider[] => {
  return [
    {
      // Trace with spans from two unique services
      spans: [
        { spanId: 'a', timestamp: new Date(), resource: { service: {name: 'ServiceA'} } },
        { spanId: 'b', timestamp: new Date(), resource: { service: {name: 'ServiceB'} } },
      ],
      expectedScore: 2,
    },
    {
      // Trace with spans from three unique services
      spans: [
        { spanId: 'a', timestamp: new Date(), resource: { service: {name: 'ServiceA'} } },
        { spanId: 'b', timestamp: new Date(), resource: { service: {name: 'ServiceB'} } },
        { spanId: 'c', timestamp: new Date(), resource: { service: {name: 'ServiceC'} } },
      ],
      expectedScore: 3, // Three unique services
    },
    {
      // Trace with multiple spans from the same service
      spans: [
        { spanId: 'a', timestamp: new Date(), resource: { service: {name: 'ServiceA'} } },
        { spanId: 'b', timestamp: new Date(), resource: { service: {name: 'ServiceA'} } },
        { spanId: 'c', timestamp: new Date(), resource: { service: {name: 'ServiceA'} } },
      ],
      expectedScore: 1, // One unique service
    },
  ];
};

