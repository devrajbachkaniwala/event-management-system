import { EventPriceError } from './event-price.error';

export class EventPriceNotFound extends EventPriceError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Event price not found', statusCode);
  }
}
