import { Inject, Injectable } from '@nestjs/common';
import { IEventPhotosService } from './event-photos-service.interface';
import { EventPhotoDto, EventPhotoDtoFactory } from '../dto';
import {
  IPrismaApiService,
  prismaApiServiceToken
} from 'src/app/modules/prisma';
import { ConfigService } from '@nestjs/config';
import { EventPhotoErrorFactory } from '../errors';
import { unlink } from 'fs';

@Injectable()
export class EventPhotosService implements IEventPhotosService {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService,
    private readonly configService: ConfigService
  ) {}

  async create(
    orgId: string,
    eventId: string,
    eventPhotoFile: Express.Multer.File
  ): Promise<EventPhotoDto> {
    try {
      const photoUrl = eventPhotoFile
        ? this.generatePhotoUrl(eventId, eventPhotoFile.filename)
        : undefined;

      const event = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          photos: {
            push: {
              photoUrl: photoUrl
            }
          }
        }
      });

      return EventPhotoDtoFactory.create(event.photos.pop());
    } catch (err: any) {
      throw EventPhotoErrorFactory.create(
        err,
        'Failed to create an event photo'
      );
    }
  }

  async findAll(eventId: string): Promise<EventPhotoDto[]> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      return event.photos.map(EventPhotoDtoFactory.create);
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
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        }
      });

      const eventPhoto = event.photos.find((p) => p.id === photoId);

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

      const updateEvent = await this.prisma.event.update({
        where: {
          id: eventId,
          organization: {
            id: orgId
          }
        },
        data: {
          photos: {
            deleteMany: {
              where: {
                id: photoId
              }
            }
          }
        }
      });

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
