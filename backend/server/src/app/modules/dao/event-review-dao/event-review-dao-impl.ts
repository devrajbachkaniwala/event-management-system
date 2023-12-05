import { Inject } from '@nestjs/common';
import { CreateEventReviewDto } from '../../events';
import { DaoError } from '../errors/dao.error';
import { IEventReviewDao, TReviewWithUser } from './event-review-dao.interface';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { Review } from '@prisma/client';

export class EventReviewDaoImpl implements IEventReviewDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    userId: string,
    eventId: string,
    createEventReviewDto: CreateEventReviewDto
  ): Promise<TReviewWithUser> {
    try {
      const review = await this.prisma.review.create({
        data: {
          description: createEventReviewDto.description,
          star: createEventReviewDto.star,

          event: {
            connect: {
              id: eventId
            }
          },

          user: {
            connect: {
              id: userId
            }
          }
        },
        include: {
          user: true
        }
      });

      return review;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findAll(eventId: string): Promise<TReviewWithUser[]> {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          event: {
            id: eventId
          }
        },
        include: {
          user: true
        }
      });

      return reviews;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findOne(eventId: string, reviewId: string): Promise<TReviewWithUser> {
    try {
      const review = await this.prisma.review.findUnique({
        where: {
          id: reviewId,
          event: {
            id: eventId
          }
        },
        include: {
          user: true
        }
      });

      return review;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async remove(
    userId: string,
    eventId: string,
    reviewId: string
  ): Promise<boolean> {
    try {
      const review = await this.prisma.review.delete({
        where: {
          id: reviewId,
          userId_eventId: {
            userId: userId,
            eventId: eventId
          }
        }
      });

      return true;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }
}
