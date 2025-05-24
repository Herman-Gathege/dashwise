import { refreshToken } from './refreshToken';

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem('token');

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (res.status === 401) {
    // Try to refresh access token
    const newToken = await refreshToken();

    if (newToken) {
      // Retry original request with new token
      res = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
    }
  }

  return res;
};
