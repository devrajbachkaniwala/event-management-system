import { Test, TestingModule } from '@nestjs/testing';
import { EventPhotosController } from './event-photos.controller';
import { EventPhotosService } from '../services/event-photos.service';

describe('EventPhotosController', () => {
  let controller: EventPhotosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventPhotosController],
      providers: [EventPhotosService]
    }).compile();

    controller = module.get<EventPhotosController>(EventPhotosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
