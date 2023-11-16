export class UserDto {
  id: string;
  username: string;
  userPhotoUrl: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  modifiedAt: Date;
  orgId: string;

  //   bookings?: BookingDto[];
}
