import { Test, TestingModule } from '@nestjs/testing';
import { EventReviewsService } from './event-reviews.service';

describe('EventReviewsService', () => {
  let service: EventReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventReviewsService],
    }).compile();

    service = module.get<EventReviewsService>(EventReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
