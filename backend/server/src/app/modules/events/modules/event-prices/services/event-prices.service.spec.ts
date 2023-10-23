import { Test, TestingModule } from '@nestjs/testing';
import { EventPricesService } from './event-prices.service';

describe('EventPricesService', () => {
  let service: EventPricesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventPricesService],
    }).compile();

    service = module.get<EventPricesService>(EventPricesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
