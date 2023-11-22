import { UpdateUserProfileDto } from '@/dto/update-user-profile.dto';
import { AccountService } from '@/services/account-service';

export const editUserProfile = async (
  userProfile: UpdateUserProfileDto,
  photoFile: File | undefined
) => {
  try {
    const user = await AccountService.editUserProfile(userProfile, photoFile);
    return user;
  } catch (err: any) {
    console.log(err);
  }
};
