import { EventDto } from '@/dto/event.dto';
import { FetchService } from './fetch-service';
import { EnvService } from './env-service';

export class EventsService {
  static async getAll(): Promise<Array<EventDto>> {
    const url = `${EnvService.getServerUrl()}/v1/events`;
    const res = await FetchService.getWithNoStore(url);

    const resData = await res.json();

    if (!res.ok) {
      throw new EventsServiceError(resData.message);
    }

    return resData.data as Array<EventDto>;
  }

  static async getOne(id: string): Promise<EventDto> {
    const url = `${EnvService.getServerUrl()}/v1/events/${id}`;
    const res = await FetchService.getWithNoStore(url);

    const resData = await res.json();

    if (!res.ok) {
      throw new EventsServiceError(resData.message);
    }

    return resData.data as EventDto;
  }
}

export class EventsServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
