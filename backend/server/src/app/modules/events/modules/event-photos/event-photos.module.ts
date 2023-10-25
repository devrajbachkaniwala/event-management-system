import { Module, Provider } from '@nestjs/common';
import { EventPhotosService, eventPhotosServiceToken } from './services';
import { EventPhotosController } from './controllers';

const eventPhotosServiceProvider: Provider = {
  provide: eventPhotosServiceToken,
  useClass: EventPhotosService
};

@Module({
  controllers: [EventPhotosController],
  providers: [eventPhotosServiceProvider]
})
export class EventPhotosModule {}
