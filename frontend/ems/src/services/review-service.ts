import { retryFunction } from '@/utils/retryFunction';
import { EnvService } from './env-service';
import { FetchService } from './fetch-service';
import { EventReviewDto } from '@/dto/event-review.dto';
import { CreateEventReviewDto } from '@/dto/create-event-review.dto';

export class ReviewService {
  static async getAll(eventId: string): Promise<EventReviewDto[]> {
    const url = `${EnvService.getServerUrl()}/v1/events/${eventId}/reviews`;
    const res = await FetchService.getWithNoStore(url);

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new ReviewServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.getAll(eventId);
      }
    }

    return resData.data as EventReviewDto[];
  }

  static async create(
    eventId: string,
    createEventReviewDto: CreateEventReviewDto
  ): Promise<EventReviewDto> {
    const url = `${EnvService.getServerUrl()}/v1/events/${eventId}/reviews`;
    const res = await FetchService.post(url, {
      authTokenType: 'accessToken',
      body: createEventReviewDto,
      contentType: 'application/json'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new ReviewServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.create(eventId, createEventReviewDto);
      }
    }

    return resData.data as EventReviewDto;
  }

  static async delete(
    eventId: string,
    reviewId: string
  ): Promise<{ message: string }> {
    const url = `${EnvService.getServerUrl()}/v1/events/${eventId}/reviews/${reviewId}`;
    const res = await FetchService.delete(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new ReviewServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.delete(eventId, reviewId);
      }
    }

    return resData.data as { message: string };
  }
}

export class ReviewServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
