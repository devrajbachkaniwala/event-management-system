import { EventDto } from '@/dto/event.dto';
import { FetchService } from './fetch-service';
import { EnvService } from './env-service';
import { CreateEventDto } from '@/dto/create-event.dto';
import { UpdateEventDto } from '@/dto/update-event.dto';
import { retryFunction } from '@/utils/retryFunction';

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

  static async create(
    createEvent: CreateEventDto,
    photoFiles: Array<File | undefined>
  ) {
    const formData = new FormData();
    const { prices, timings, ...event } = createEvent;

    for (const [key, value] of Object.entries(event)) {
      formData.append(key, value);
    }

    prices.forEach((price, idx) => {
      for (const [key, value] of Object.entries(price)) {
        const k = `prices[${idx}][${key}]`;
        formData.append(k, value);
      }
    });

    timings.forEach((timing, idx) => {
      for (const [key, value] of Object.entries(timing)) {
        const k = `timings[${idx}][${key}]`;
        formData.append(k, value);
      }
    });

    photoFiles.forEach((photoFile, idx) => {
      if (photoFile) {
        formData.append(`photos`, photoFile, photoFile.name);
      }
    });

    console.log(JSON.stringify(Object.fromEntries(formData.entries())));

    const url = `${EnvService.getServerUrl()}/v1/events`;
    const res = await FetchService.post(url, {
      authTokenType: 'accessToken',
      contentType: 'form-data',
      body: formData
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new EventsServiceError(resData.message);
    }

    return resData.data as EventDto;
  }

  static async update(
    eventId: string,
    updateEvent: UpdateEventDto,
    photoFiles: Array<File | undefined>
  ) {
    const formData = new FormData();
    const { prices, timings, ...event } = updateEvent;

    for (const [key, value] of Object.entries(event)) {
      formData.append(key, value);
    }

    prices?.forEach((price, idx) => {
      for (const [key, value] of Object.entries(price)) {
        const k = `prices[${idx}][${key}]`;
        formData.append(k, value);
      }
    });

    timings?.forEach((timing, idx) => {
      for (const [key, value] of Object.entries(timing)) {
        const k = `timings[${idx}][${key}]`;
        formData.append(k, value);
      }
    });

    photoFiles.forEach((photoFile, idx) => {
      if (photoFile) {
        formData.append(`photos`, photoFile, photoFile.name);
      }
    });

    console.log(JSON.stringify(Object.fromEntries(formData.entries())));

    const url = `${EnvService.getServerUrl()}/v1/events/${eventId}`;
    const res = await FetchService.patch(url, {
      authTokenType: 'accessToken',
      contentType: 'form-data',
      body: formData
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new EventsServiceError(resData.message);
    }

    return resData.data as EventDto;
  }

  static async delete(eventId: string): Promise<{ message: string }> {
    const url = `${EnvService.getServerUrl()}/v1/events/${eventId}`;
    const res = await FetchService.delete(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 401) {
      throw new EventsServiceError(resData.message);
    } else if (res.status === 401) {
      const isCallable = await retryFunction(res);
      if (isCallable) {
        return await this.delete(eventId);
      }
    }

    return resData.data as { message: string };
  }
}

export class EventsServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
