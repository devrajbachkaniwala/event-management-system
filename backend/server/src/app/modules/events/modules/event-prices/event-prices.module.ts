import { Module, Provider } from '@nestjs/common';
import { EventPricesController } from './controllers';
import { EventPricesService, eventPricesServiceToken } from './services';

const eventPricesServiceProvider: Provider = {
  provide: eventPricesServiceToken,
  useClass: EventPricesService
};

@Module({
  controllers: [EventPricesController],
  providers: [eventPricesServiceProvider]
})
export class EventPricesModule {}
