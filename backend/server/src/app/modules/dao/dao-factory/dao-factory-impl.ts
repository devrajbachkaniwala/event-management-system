import { Inject, Injectable } from '@nestjs/common';
import { IDaoFactory } from './dao-factory.interface';
import { IEventDao, eventDaoToken } from '../event-dao/event-dao.interface';
import {
  IEventPriceDao,
  eventPriceDaoToken
} from '../event-price-dao/event-price-dao.interface';
import {
  IEventTimingDao,
  eventTimingDaoToken
} from '../event-timing-dao/event-timing-dao.interface';
import {
  IEventPhotoDao,
  eventPhotoDaoToken
} from '../event-photo-dao/event-photo-dao.interface';
import {
  IEventReviewDao,
  eventReviewDaoToken
} from '../event-review-dao/event-review-dao.interface';
import {
  IBookingDao,
  bookingDaoToken
} from '../booking-dao/booking-dao.interface';
import {
  IOrganizationDao,
  organizationDaoToken
} from '../organization-dao/organization-dao.interface';
import { IUserDao, userDaoToken } from '../user-dao/user-dao.interface';
import {
  IUserTokenDao,
  userTokenDaoToken
} from '../user-token-dao/user-token-dao.interface';

@Injectable()
export class DaoFactoryImpl implements IDaoFactory {
  constructor(
    @Inject(eventDaoToken) private readonly eventDao: IEventDao,
    @Inject(eventPriceDaoToken) private readonly eventPriceDao: IEventPriceDao,
    @Inject(eventTimingDaoToken)
    private readonly eventTimingDao: IEventTimingDao,
    @Inject(eventPhotoDaoToken)
    private readonly eventPhotoDao: IEventPhotoDao,
    @Inject(eventReviewDaoToken)
    private readonly eventReviewDao: IEventReviewDao,
    @Inject(bookingDaoToken)
    private readonly bookingDao: IBookingDao,
    @Inject(organizationDaoToken)
    private readonly organizationDao: IOrganizationDao,
    @Inject(userDaoToken)
    private readonly userDao: IUserDao,
    @Inject(userTokenDaoToken)
    private readonly userTokenDao: IUserTokenDao
  ) {}

  getUserTokenDao(): IUserTokenDao {
    return this.userTokenDao;
  }

  getUserDao(): IUserDao {
    return this.userDao;
  }

  getOrganizationDao(): IOrganizationDao {
    return this.organizationDao;
  }

  getBookingDao(): IBookingDao {
    return this.bookingDao;
  }

  getEventReviewDao(): IEventReviewDao {
    return this.eventReviewDao;
  }

  getEventPhotoDao(): IEventPhotoDao {
    return this.eventPhotoDao;
  }

  getEventTimingDao(): IEventTimingDao {
    return this.eventTimingDao;
  }

  getEventPriceDao(): IEventPriceDao {
    return this.eventPriceDao;
  }

  getEventDao(): IEventDao {
    return this.eventDao;
  }
}
