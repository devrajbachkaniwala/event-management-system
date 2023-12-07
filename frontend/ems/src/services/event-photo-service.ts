import { EnvService } from './env-service';
import { FetchService } from './fetch-service';

export class EventPhotoService {
  static async delete(
    eventId: string,
    photoId: string
  ): Promise<{ message: string }> {
    const url = `${EnvService.getServerUrl()}/v1/events/${eventId}/photos/${photoId}`;
    const res = await FetchService.delete(url, {
      authTokenType: 'accessToken'
    });

    const resData = await res.json();

    if (!res.ok) {
      throw new EventPhotoServiceError(resData.message);
    }

    return resData.data as { message: string };
  }
}

export class EventPhotoServiceError extends Error {
  constructor(message: string) {
    super(message);
  }
}
