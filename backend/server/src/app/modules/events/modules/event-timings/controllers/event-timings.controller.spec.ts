import { Test, TestingModule } from '@nestjs/testing';
import { EventTimingsController } from './event-timings.controller';
import { EventTimingsService } from '../services/event-timings.service';

describe('EventTimingsController', () => {
  let controller: EventTimingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventTimingsController],
      providers: [EventTimingsService]
    }).compile();

    controller = module.get<EventTimingsController>(EventTimingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
