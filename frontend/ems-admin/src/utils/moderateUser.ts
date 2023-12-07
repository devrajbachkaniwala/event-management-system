import { ModerateUserDto } from '@/dto/moderate-user.dto';
import { UsersService } from '@/services/users-service';

export const moderateUser = async (
  userId: string,
  moderateUserDto: ModerateUserDto
) => {
  try {
    const user = await UsersService.moderate(userId, moderateUserDto);

    return user;
  } catch (err: any) {
    console.log(err);
  }
};
