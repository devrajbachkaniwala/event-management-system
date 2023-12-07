import { IBookingDao } from '../booking-dao/booking-dao.interface';
import { IEventDao } from '../event-dao/event-dao.interface';
import { IEventPhotoDao } from '../event-photo-dao/event-photo-dao.interface';
import { IEventPriceDao } from '../event-price-dao/event-price-dao.interface';
import { IEventReviewDao } from '../event-review-dao/event-review-dao.interface';
import { IEventTimingDao } from '../event-timing-dao/event-timing-dao.interface';
import { IOrganizationDao } from '../organization-dao/organization-dao.interface';
import { IUserDao } from '../user-dao/user-dao.interface';
import { IUserTokenDao } from '../user-token-dao/user-token-dao.interface';

export const daoFactoryToken = Symbol('daoFactoryToken');
export interface IDaoFactory {
  getEventDao(): IEventDao;

  getEventPriceDao(): IEventPriceDao;

  getEventTimingDao(): IEventTimingDao;

  getEventPhotoDao(): IEventPhotoDao;

  getEventReviewDao(): IEventReviewDao;

  getBookingDao(): IBookingDao;

  getOrganizationDao(): IOrganizationDao;

  getUserDao(): IUserDao;

  getUserTokenDao(): IUserTokenDao;
}
