import { Module, Provider } from '@nestjs/common';
import { UsersService, usersServiceToken } from './services';
import { UsersController } from './controllers';
import { BookingsModule } from '../bookings';

const usersServiceProvider: Provider = {
  provide: usersServiceToken,
  useClass: UsersService
};

@Module({
  imports: [BookingsModule],
  controllers: [UsersController],
  providers: [usersServiceProvider]
})
export class UsersModule {}
