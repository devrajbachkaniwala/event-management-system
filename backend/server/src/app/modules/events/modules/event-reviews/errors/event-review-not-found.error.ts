import { EventReviewError } from './event-review.error';

export class EventReviewNotFound extends EventReviewError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Event review not found', statusCode);
  }
}
