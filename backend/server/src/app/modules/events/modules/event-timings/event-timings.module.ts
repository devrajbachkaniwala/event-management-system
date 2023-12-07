import { Module, Provider } from '@nestjs/common';
import { EventTimingsService, eventTimingsServiceToken } from './services';
import { EventTimingsController } from './controllers';

const eventTimingsServiceProvider: Provider = {
  provide: eventTimingsServiceToken,
  useClass: EventTimingsService
};

@Module({
  controllers: [EventTimingsController],
  providers: [eventTimingsServiceProvider]
})
export class EventTimingsModule {}
