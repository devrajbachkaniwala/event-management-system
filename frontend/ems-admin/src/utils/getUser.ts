import { UsersService } from '@/services/users-service';

export const getUser = async (userId: string) => {
  try {
    const user = await UsersService.get(userId);

    return user;
  } catch (err: any) {
    console.log(err);
  }
};
