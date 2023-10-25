import { Test, TestingModule } from '@nestjs/testing';
import { EventPhotosService } from './event-photos.service';

describe('EventPhotosService', () => {
  let service: EventPhotosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventPhotosService],
    }).compile();

    service = module.get<EventPhotosService>(EventPhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
