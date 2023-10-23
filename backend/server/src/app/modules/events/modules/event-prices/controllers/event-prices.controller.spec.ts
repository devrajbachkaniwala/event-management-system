import { Test, TestingModule } from '@nestjs/testing';
import { EventPricesController } from './event-prices.controller';
import { EventPricesService } from '../services/event-prices.service';

describe('EventPricesController', () => {
  let controller: EventPricesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventPricesController],
      providers: [EventPricesService]
    }).compile();

    controller = module.get<EventPricesController>(EventPricesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
