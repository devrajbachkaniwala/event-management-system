import { Inject, Injectable } from '@nestjs/common';
import { IEventPhotosService } from './event-photos-service.interface';
import { EventPhotoDto, EventPhotoDtoFactory } from '../dto';
import { ConfigService } from '@nestjs/config';
import { EventPhotoErrorFactory } from '../errors';
import { unlink } from 'fs';
import {
  IDaoFactory,
  daoFactoryToken
} from 'src/app/modules/dao/dao-factory/dao-factory.interface';
import { IEventPhotoDao } from 'src/app/modules/dao/event-photo-dao/event-photo-dao.interface';

@Injectable()
export class EventPhotosService implements IEventPhotosService {
  private eventPhotoDao: IEventPhotoDao;

  constructor(
    @Inject(daoFactoryToken) daoFactory: IDaoFactory,
    private readonly configService: ConfigService
  ) {
    this.eventPhotoDao = daoFactory.getEventPhotoDao();
  }

  async create(
    orgId: string,
    eventId: string,
    eventPhotoFile: Express.Multer.File
  ): Promise<EventPhotoDto> {
    try {
      const photoUrl = eventPhotoFile
        ? this.generatePhotoUrl(eventId, eventPhotoFile.filename)
        : undefined;

      const eventPhoto = await this.eventPhotoDao.create(
        orgId,
        eventId,
        photoUrl
      );

      return EventPhotoDtoFactory.create(eventPhoto);
    } catch (err: any) {
      throw EventPhotoErrorFactory.create(
        err,
        'Failed to create an event photo'
      );
    }
  }

  async findAll(eventId: string): Promise<EventPhotoDto[]> {
    try {
      const eventPhotos = await this.eventPhotoDao.findAll(eventId);

      return eventPhotos.map(EventPhotoDtoFactory.create);
    } catch (err: any) {
      throw EventPhotoErrorFactory.create(
        err,
        'Failed to get all event photos'
      );
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} eventPhoto`;
  // }

  // update(id: number, updateEventPhotoDto: UpdateEventPhotoDto) {
  //   return `This action updates a #${id} eventPhoto`;
  // }

  async remove(orgId: string, eventId: string, photoId: string): Promise<true> {
    try {
      const eventPhoto = await this.eventPhotoDao.findOne(eventId, photoId);

      if (eventPhoto) {
        const filename = eventPhoto.photoUrl.split('/').pop();
        const filePath = `./uploads/event-photos/${filename}`;
        const isDeleted = await new Promise((resolve, reject) =>
          unlink(filePath, (err) => {
            if (err) reject(err);
            resolve(true);
          })
        );
      }

      const isPhotoDeleted = await this.eventPhotoDao.remove(
        orgId,
        eventId,
        photoId
      );

      return true;
    } catch (err: any) {
      throw EventPhotoErrorFactory.create(
        err,
        'Failed to delete an event photo'
      );
    }
  }

  private generatePhotoUrl(eventId: string, filename: string): string {
    return `${this.configService.get(
      'SERVER_URL'
    )}/v1/events/${eventId}/photos/${filename}`;
  }
}
