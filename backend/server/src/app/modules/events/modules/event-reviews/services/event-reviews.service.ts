import { Inject, Injectable } from '@nestjs/common';
import {
  CreateEventReviewDto,
  EventReviewDto,
  EventReviewDtoFactory
} from '../dto';
import { IEventReviewsService } from './event-reviews-service.interface';
import {
  IPrismaApiService,
  prismaApiServiceToken
} from 'src/app/modules/prisma';
import { EventReviewErrorFactory, EventReviewNotFound } from '../errors';

@Injectable()
export class EventReviewsService implements IEventReviewsService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async create(
    userId: string,
    eventId: string,
    createEventReviewDto: CreateEventReviewDto
  ): Promise<EventReviewDto> {
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
        }
      });

      return EventReviewDtoFactory.create(review);
    } catch (err: any) {
      throw EventReviewErrorFactory.create(
        err,
        'Failed to create an event review'
      );
    }
  }

  async findAll(eventId: string): Promise<EventReviewDto[]> {
    try {
      const reviews = await this.prisma.review.findMany({
        where: {
          event: {
            id: eventId
          }
        }
      });

      return reviews.map(EventReviewDtoFactory.create);
    } catch (err: any) {
      throw EventReviewErrorFactory.create(
        err,
        'Failed to get all event reviews'
      );
    }
  }

  async findOne(eventId: string, reviewId: string): Promise<EventReviewDto> {
    try {
      const review = await this.prisma.review.findUnique({
        where: {
          id: reviewId,
          event: {
            id: eventId
          }
        }
      });

      if (!review) {
        throw new EventReviewNotFound();
      }

      return EventReviewDtoFactory.create(review);
    } catch (err: any) {
      throw EventReviewErrorFactory.create(
        err,
        'Failed to get an event review'
      );
    }
  }

  // update(id: number, updateEventReviewDto: UpdateEventReviewDto) {
  //   return `This action updates a #${id} eventReview`;
  // }

  async remove(
    userId: string,
    eventId: string,
    reviewId: string
  ): Promise<true> {
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
      throw EventReviewErrorFactory.create(
        err,
        'Failed to delete an event review'
      );
    }
  }
}
