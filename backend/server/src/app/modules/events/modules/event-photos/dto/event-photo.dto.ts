import { EventPhoto } from '@prisma/client';

export class EventPhotoDto {
  id: string;
  photoUrl: string;
}

export class EventPhotoDtoFactory {
  static create(photo: EventPhoto): EventPhotoDto {
    const eventPhotoDto: EventPhotoDto = new EventPhotoDto();

    eventPhotoDto.id = photo.id;
    eventPhotoDto.photoUrl = photo.photoUrl;

    return eventPhotoDto;
  }
}
