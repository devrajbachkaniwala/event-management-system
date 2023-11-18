import { refetchAccessToken } from './refetchAccessToken';

type TEnhancedRevalidateFetch = {
  method?: 'POST' | 'PATCH' | 'GET' | 'DELETE';
  headers?: HeadersInit | undefined;
  body?: BodyInit | undefined | null;
};

export const enhancedRevalidateFetch = async (
  url: string,
  { method, headers, body }: TEnhancedRevalidateFetch & RequestInit
) => {
  const res = await fetch(url, {
    method,
    headers,
    body
  });

  if (res.status === 401) {
    const token = await refetchAccessToken();

    if (token) {
      return fetch(url, {
        method,
        headers,
        body
      });
    }
  }
  return res;
};
