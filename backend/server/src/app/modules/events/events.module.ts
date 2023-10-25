import { Module, Provider } from '@nestjs/common';
import { EventsService, eventsServiceToken } from './services';
import {
  EventPhotosModule,
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
    EventPhotosModule,
    RouterModule.register([
      {
        path: 'events',
        children: [
          { path: ':event_id', module: EventPricesModule },
          { path: ':event_id', module: EventTimingsModule },
          { path: ':event_id', module: EventReviewsModule },
          { path: ':event_id', module: EventPhotosModule }
        ]
      }
    ])
  ],
  controllers: [EventsController],
  providers: [eventsServiceProvider]
})
export class EventsModule {}
