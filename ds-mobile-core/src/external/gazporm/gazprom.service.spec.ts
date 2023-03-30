import { GazpormService } from './gazporm.service';
import { GazpromRepository } from './gazprom.repository';
import { Test } from '@nestjs/testing';

const mockGazpromRepository = () => ({
  getExistingSession: jest.fn(),
});

describe('Gazprom Service', () => {
  let gazpromService: GazpormService;
  let gazpromRepository: GazpromRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GazpormService,
        { provide: GazpromRepository, useFactory: mockGazpromRepository },
      ],
    }).compile();

    gazpromService = module.get(GazpormService);
    gazpromRepository = module.get(GazpromRepository);
  });

  describe('Get client existing session', () => {
    it('calls gazpromRepository.getExistingSession and returns result', () => {
      expect(gazpromRepository.getExistingSession).not.toHaveBeenCalled();
    });
  });
});
