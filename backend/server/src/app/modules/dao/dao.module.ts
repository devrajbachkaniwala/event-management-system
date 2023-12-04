import { Global, Module, Provider } from '@nestjs/common';
import { eventDaoToken } from './event-dao/event-dao.interface';
import { EventDaoImpl } from './event-dao/event-dao-impl';
import { daoFactoryToken } from './dao-factory/dao-factory.interface';
import { DaoFactoryImpl } from './dao-factory/dao-factory-impl';
import { eventPriceDaoToken } from './event-price-dao/event-price-dao.interface';
import { EventPriceDaoImpl } from './event-price-dao/event-price-dao-impl';
import { eventTimingDaoToken } from './event-timing-dao/event-timing-dao.interface';
import { EventTimingDaoImpl } from './event-timing-dao/event-timing-dao-impl';
import { EventPhotoDaoImpl } from './event-photo-dao/event-photo-dao-impl';
import { eventPhotoDaoToken } from './event-photo-dao/event-photo-dao.interface';
import { EventReviewDaoImpl } from './event-review-dao/event-review-dao-impl';
import { eventReviewDaoToken } from './event-review-dao/event-review-dao.interface';
import { BookingDaoImpl } from './booking-dao/booking-dao-impl';
import { bookingDaoToken } from './booking-dao/booking-dao.interface';
import { OrganizationDaoImpl } from './organization-dao/organization-dao-impl';
import { organizationDaoToken } from './organization-dao/organization-dao.interface';
import { UserDaoImpl } from './user-dao/user-dao-impl';
import { userDaoToken } from './user-dao/user-dao.interface';
import { UserTokenDaoImpl } from './user-token-dao/user-token-dao-impl';
import { userTokenDaoToken } from './user-token-dao/user-token-dao.interface';

const daoFactoryProvider: Provider = {
  provide: daoFactoryToken,
  useClass: DaoFactoryImpl
};

const eventDaoProvider: Provider = {
  provide: eventDaoToken,
  useClass: EventDaoImpl
};

const eventPriceDaoProvider: Provider = {
  provide: eventPriceDaoToken,
  useClass: EventPriceDaoImpl
};

const eventTimingDaoProvider: Provider = {
  provide: eventTimingDaoToken,
  useClass: EventTimingDaoImpl
};

const eventPhotoDaoProvider: Provider = {
  provide: eventPhotoDaoToken,
  useClass: EventPhotoDaoImpl
};

const eventReviewDaoProvider: Provider = {
  provide: eventReviewDaoToken,
  useClass: EventReviewDaoImpl
};

const bookingDaoProvider: Provider = {
  provide: bookingDaoToken,
  useClass: BookingDaoImpl
};

const organizationDaoProvider: Provider = {
  provide: organizationDaoToken,
  useClass: OrganizationDaoImpl
};

const userDaoProvider: Provider = {
  provide: userDaoToken,
  useClass: UserDaoImpl
};

const userTokenDaoProvider: Provider = {
  provide: userTokenDaoToken,
  useClass: UserTokenDaoImpl
};

@Global()
@Module({
  controllers: [],
  providers: [
    daoFactoryProvider,
    eventDaoProvider,
    eventPriceDaoProvider,
    eventTimingDaoProvider,
    eventPhotoDaoProvider,
    eventReviewDaoProvider,
    bookingDaoProvider,
    organizationDaoProvider,
    userDaoProvider,
    userTokenDaoProvider
  ],
  exports: [daoFactoryProvider]
})
export class DaoModule {}
