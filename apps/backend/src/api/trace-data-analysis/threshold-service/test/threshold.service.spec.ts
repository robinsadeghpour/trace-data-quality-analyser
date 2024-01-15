import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ThresholdService } from '../index';
import { TraceDataAnalysisEntity } from '../../trace-data-analysis.entity';
import {
  thresholdDataProvider,
  ThresholdServiceDataProvider,
} from './threshold.service.data-provider';

describe('ThresholdService', () => {
  let service: ThresholdService;
  let mockRepository;

  beforeEach(async () => {
    mockRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThresholdService,
        {
          provide: getRepositoryToken(TraceDataAnalysisEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ThresholdService>(ThresholdService);
  });

  describe.each(thresholdDataProvider)(
    'Threshold Service',
    ({ prev, curr, expectedResult }: ThresholdServiceDataProvider) => {
      it('should provide correct overruns', async () => {
        mockRepository.findOne.mockResolvedValue(prev);

        const result = await service.checkThresholds(curr);

        expect(result).toStrictEqual(expectedResult);
      });
    }
  );

  it('should return empty when no previous value correct overruns', async () => {
    mockRepository.findOne.mockResolvedValue(null);

    const result = await service.checkThresholds({
      futureEntry: 10,
    });

    expect(result).toStrictEqual([]);
  });
});
