import { Module, Provider } from '@nestjs/common';
import { EventsService, eventsServiceToken } from './services';
import {
  EventPricesModule,
  EventReviewsModule,
  EventTimingsModule
} from './modules';
import { EventsController } from './controllers';
import { RouterModule } from '@nestjs/core';

const eventsServiceProvider: Provider = {
  provide: eventsServiceToken,
  useClass: EventsService
};

@Module({
  imports: [
    EventPricesModule,
    EventTimingsModule,
    EventReviewsModule,
    RouterModule.register([
      {
        path: 'events',
        children: [
          { path: ':event_id', module: EventPricesModule },
          { path: ':event_id', module: EventTimingsModule },
          { path: ':event_id', module: EventReviewsModule }
        ]
      }
    ])
  ],
  controllers: [EventsController],
  providers: [eventsServiceProvider]
})
export class EventsModule {}
