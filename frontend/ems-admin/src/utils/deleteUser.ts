import { UsersService } from '@/services/users-service';

export const deleteUser = async (userId: string) => {
  try {
    const res = await UsersService.delete(userId);

    return res;
  } catch (err: any) {
    console.log(err);
  }
};
