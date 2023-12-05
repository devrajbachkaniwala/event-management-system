import { UserDto } from './user.dto';

export class EventReviewDto {
  id: string;
  description: string;
  star: number;
  createdAt: Date;
  modifiedAt: Date;
  userId: string;
  eventId: string;

  user?: UserDto;
}
