import { TraceDataMetricsService } from '../trace-data-metrics.service';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getDuplicatesWithinTraceDataProvider,
  getFutureEntryDataProvider,
  getInfrequentEventOrderingDataProvider,
  getMissingActivityDataProvider,
  getMissingPropertiesDataProvider,
  getSpanTimeCoverageDataProvider,
  getSTCPSCoverageDataProvider,
  getTraceBreadthDataProvider,
  getTraceDepthDataProvider,
  STCPSDataProvider,
  TraceDataProvider,
} from './trace-data-metrics.data-provider';
import { Span } from '@tdqa/types';

describe('TraceDataMetricsService', () => {
  let underTest: TraceDataMetricsService;
  let dateNowSpy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TraceDataMetricsService],
    }).compile();

    underTest = module.get<TraceDataMetricsService>(TraceDataMetricsService);
  });

  afterAll(() => {
    dateNowSpy.mockRestore();
  });

  describe.each(getInfrequentEventOrderingDataProvider())(
    'Infrequent Event Ordering',
    ({ spans, expectedScore }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateInfrequentEventOrdering([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result.avgScore).toBe(expectedScore);
      });
    }
  );

  describe.each(getFutureEntryDataProvider())(
    'Infrequent Event Ordering',
    ({ spans, expectedScore, currentTime }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        dateNowSpy = jest
          .spyOn(Date, 'now')
          .mockImplementation(() => currentTime?.getTime() ?? Date.now());
        const result = underTest.calculateFutureEntry([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result).toBe(expectedScore);
      });
    }
  );

  describe.each(getSpanTimeCoverageDataProvider())(
    'Span Time Coverage',
    ({ spans, expectedScore }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateSTC([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result.avgScore).toBe(expectedScore);
      });
    }
  );

  describe.each(getSTCPSCoverageDataProvider())(
    'Span Time Coverage per Service',
    ({ spans, expectedScores }: STCPSDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateSTCPS([
          { id: '', spans: spans as Span[] },
        ]);

        console.log(result)

        // Iterate over each service in the expectedScores and check the result
        for (const [serviceName, expectedScore] of Object.entries(
          expectedScores
        )) {
          expect(result[serviceName]).toBe(expectedScore);
        }
      });
    }
  );

  describe.each(getMissingPropertiesDataProvider())(
    'Missing Properties',
    ({ spans, expectedScore }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateMissingProperties([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result.avgScore).toBe(expectedScore);
      });
    }
  );

  describe.each(getDuplicatesWithinTraceDataProvider())(
    'Duplicates Within Trace',
    ({ spans, expectedScore }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateDuplicatesWithinTrace([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result).toBe(expectedScore);
      });
    }
  );

  describe.each(getMissingActivityDataProvider())(
    'Missing Activity',
    ({ spans, expectedScore }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateMissingActivity([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result).toBe(expectedScore);
      });
    }
  );

  describe.each(getTraceDepthDataProvider())(
    'Trace Depth',
    ({ spans, expectedScore }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateTraceDepth([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result.avgScore).toBe(expectedScore);
      });
    }
  );

  describe.each(getTraceBreadthDataProvider())(
    'Trace Breadth',
    ({ spans, expectedScore }: TraceDataProvider) => {
      it(`should calculate the correct score for given spans`, () => {
        const result = underTest.calculateTraceBreadth([
          { id: '', spans: spans as Span[] },
        ]);
        expect(result.avgScore).toBe(expectedScore);
      });
    }
  );

  // describe.each(getPrecisionDataProvider())(
  //   'Precision',
  //   ({ spans, expectedScore }: TraceDataProvider) => {
  //     it(`should calculate the correct score for given spans`, () => {
  //       const result = underTest.calculatePrecision([
  //         { id: '', spans: spans as Span[] },
  //       ]);
  //       expect(result.avgScore).toBe(expectedScore);
  //     });
  //   }
  // );
});
