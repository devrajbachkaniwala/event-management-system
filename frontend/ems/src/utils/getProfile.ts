import { AccountService } from '@/services/account-service';

export const getProfile = async () => {
  try {
    const user = await AccountService.getUserProfile();
    return user;
  } catch (err: any) {
    console.log(err);
  }
};
