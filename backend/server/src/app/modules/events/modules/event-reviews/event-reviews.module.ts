import { Module, Provider } from '@nestjs/common';
import { EventReviewsService, eventReviewsServiceToken } from './services';
import { EventReviewsController } from './controllers';

const eventReviewsServiceProvider: Provider = {
  provide: eventReviewsServiceToken,
  useClass: EventReviewsService
};

@Module({
  controllers: [EventReviewsController],
  providers: [eventReviewsServiceProvider]
})
export class EventReviewsModule {}
