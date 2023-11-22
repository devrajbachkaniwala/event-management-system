import { AuthService } from '@/services/auth-service';
import { TokenService } from '@/services/token-service';

export const logout = async () => {
  try {
    const res = await AuthService.logout();
    TokenService.removeAllTokens();

    return res;
  } catch (err: any) {
    console.log(err);
  }
};
