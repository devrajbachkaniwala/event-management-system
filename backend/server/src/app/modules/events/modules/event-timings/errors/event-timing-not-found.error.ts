import { EventTimingError } from './event-timing.error';

export class EventTimingNotFound extends EventTimingError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Event timing not found', statusCode);
  }
}
