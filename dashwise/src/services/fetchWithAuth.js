// import { refreshToken } from './refreshToken';

// export const fetchWithAuth = async (url, options = {}) => {
//   let token = localStorage.getItem('token');

//   let res = await fetch(url, {
//     ...options,
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${token}`,
//       'Content-Type': 'application/json',
//     },
//   });

//   if (res.status === 401) {
//     // Try to refresh access token
//     const newToken = await refreshToken();

//     if (newToken) {
//       // Retry original request with new token
//       res = await fetch(url, {
//         ...options,
//         headers: {
//           ...options.headers,
//           Authorization: `Bearer ${newToken}`,
//           'Content-Type': 'application/json',
//         },
//       });
//     }
//   }

//   return res;
// };

import { refreshToken } from "./refreshToken";

let refreshingTokenPromise = null;

export const fetchWithAuth = async (url, options = {}) => {
  let token = localStorage.getItem("token");

  const makeRequest = (tokenToUse) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${tokenToUse}`,
        "Content-Type": "application/json",
      },
    });
  };

  let res = await makeRequest(token);

  if (res.status === 401) {
    // If a token refresh is already in progress, wait for it
    if (!refreshingTokenPromise) {
      refreshingTokenPromise = refreshToken();
    }

    const newToken = await refreshingTokenPromise;
    refreshingTokenPromise = null;

    if (newToken) {
      // Retry original request with new token
      res = await makeRequest(newToken);
    } else {
      // Refresh token expired or invalid, clear storage and handle logout
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      // Optional: redirect to login or notify user
      window.location.href = "/login"; // Adjust this path if your login route is different
      return;
    }
  }

  return res;
};
