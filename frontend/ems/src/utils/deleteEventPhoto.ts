import { EventPhotoService } from '@/services/event-photo-service';

export const deleteEventPhoto = async (eventId: string, photoId: string) => {
  try {
    const res = await EventPhotoService.delete(eventId, photoId);
    return res;
  } catch (err: any) {
    console.log(err);
  }
};
