import { GazpormService } from './gazporm.service';
import { GazpromRepository } from './gazprom.repository';
import { Test } from '@nestjs/testing';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GetExistingSessionDto } from './dto/req/get-existing-session.dto';

const mockGazpromRepository = () => ({
  getExistingSession: jest.fn(),
});

const mockGetExistingSessionDto: GetExistingSessionDto = {
  clientId: '54223',
};

describe('Gazprom Service', () => {
  let gazpromService: GazpormService;
  let gazpromRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GazpormService,
        { provide: GazpromRepository, useFactory: mockGazpromRepository },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: {
            warn: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    gazpromService = module.get(GazpormService);
    gazpromRepository = module.get(GazpromRepository);
  });

  describe('Get client existing session', () => {
    it('calls gazpromRepository.getExistingSession and returns result', async () => {
      gazpromRepository.getExistingSession.mockResolvedValue('Hello');

      const response = await gazpromService.getExistingSession(
        mockGetExistingSessionDto,
      );
      expect(response).toEqual('Hello');
    });
  });
});
