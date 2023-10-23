import { EventError } from './event.error';

export class EventNotFound extends EventError {
  constructor(message?: string, statusCode?: number) {
    super(message ?? 'Event not found', statusCode);
  }
}
