import { EventPhoto } from '@prisma/client';

export const eventPhotoDaoToken = Symbol('eventPhotoDaoToken');
export interface IEventPhotoDao {
  create(orgId: string, eventId: string, photoUrl: string): Promise<EventPhoto>;

  findAll(eventId: string): Promise<EventPhoto[]>;

  findOne(eventId: string, photoId: string): Promise<EventPhoto>;

  // update(arg0: number, updateEventPhotoDto: UpdateEventPhotoDto): unknown;

  remove(orgId: string, eventId: string, photoId: string): Promise<boolean>;
}
