import { AuthService } from '@/services/auth-service';
import { LocalStorageService } from '@/services/local-storage-service';
import { TokenService } from '@/services/token-service';

export const refetchAccessToken = async () => {
  try {
    const token = await AuthService.getAccessToken();

    TokenService.setAccessToken(token.accessToken);

    return token;
  } catch (err: any) {
    TokenService.removeAllTokens();

    throw new Error(err.message);
  }
};
