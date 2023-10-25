import { EventPhotoDto } from '../dto';

export const eventPhotosServiceToken = Symbol('eventPhotosServiceToken');
export interface IEventPhotosService {
  create(
    orgId: string,
    eventId: string,
    eventPhotoFile: Express.Multer.File
  ): Promise<EventPhotoDto>;
  findAll(eventId: string): Promise<EventPhotoDto[]>;
  // findOne(arg0: number): unknown;
  // update(arg0: number, updateEventPhotoDto: UpdateEventPhotoDto): unknown;
  remove(orgId: string, eventId: string, photoId: string): Promise<true>;
}
