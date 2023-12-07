import { Test, TestingModule } from '@nestjs/testing';
import { EventReviewsController } from './event-reviews.controller';
import { EventReviewsService } from '../services/event-reviews.service';

describe('EventReviewsController', () => {
  let controller: EventReviewsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventReviewsController],
      providers: [EventReviewsService]
    }).compile();

    controller = module.get<EventReviewsController>(EventReviewsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
