import { Test, TestingModule } from '@nestjs/testing';
import { EventTimingsService } from './event-timings.service';

describe('EventTimingsService', () => {
  let service: EventTimingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventTimingsService],
    }).compile();

    service = module.get<EventTimingsService>(EventTimingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
