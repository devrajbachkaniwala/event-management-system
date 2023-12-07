import { Module, Provider } from '@nestjs/common';
import { BookingsService, bookingsServiceToken } from './services';
import { BookingsController } from './controllers';

const bookingsServiceProvider: Provider = {
  provide: bookingsServiceToken,
  useClass: BookingsService
};

@Module({
  controllers: [BookingsController],
  providers: [bookingsServiceProvider],
  exports: [bookingsServiceProvider]
})
export class BookingsModule {}
