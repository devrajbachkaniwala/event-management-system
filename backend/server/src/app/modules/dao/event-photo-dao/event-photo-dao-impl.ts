import { Inject } from '@nestjs/common';
import { IEventPhotoDao } from './event-photo-dao.interface';
import { IPrismaApiService, prismaApiServiceToken } from '../../prisma';
import { DaoError } from '../errors/dao.error';
import { EventPhoto } from '@prisma/client';

export class EventPhotoDaoImpl implements IEventPhotoDao {
  constructor(
    @Inject(prismaApiServiceToken) private readonly prisma: IPrismaApiService
  ) {}

  async findOne(eventId: string, photoId: string): Promise<EventPhoto> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      return event.photos.find((p) => p.id === photoId);
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async create(
    orgId: string,
    eventId: string,
    photoUrl: string
  ): Promise<EventPhoto> {
    try {
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
              photoUrl
            }
          }
        }
      });

      return event.photos.pop();
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async findAll(eventId: string): Promise<EventPhoto[]> {
    try {
      const event = await this.prisma.event.findUnique({
        where: {
          id: eventId
        }
      });

      return event.photos;
    } catch (err: any) {
      throw new DaoError(err.message);
    }
  }

  async remove(
    orgId: string,
    eventId: string,
    photoId: string
  ): Promise<boolean> {
    try {
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
      throw new DaoError(err.message);
    }
  }
}
