type TLoginCredentials = {
  email: string;
  password: string;
};

type TTokens = {
  accessToken: string;
  refreshToken: string;
};

type TToken = {
  accessToken: string;
};

type TToast = {
  success: boolean;
  message: string;
};

type TCreateEventPhoto = {
  id: string;
  file?: File | undefined;
  photoUrl?: string;
  touched: boolean;
};
