export const refreshToken = async () => {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return null;

  const res = await fetch('http://localhost:5000/refresh', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${refresh}`,
    },
  });

  if (res.ok) {
    const data = await res.json();
    localStorage.setItem('token', data.access_token);
    return data.access_token;
  } else {
    console.warn("Refresh token expired or invalid");
    return null;
  }
};
