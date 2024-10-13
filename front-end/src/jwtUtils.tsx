export const isJWTTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const expirationTime = payload.exp * 1000;
  return Date.now() < expirationTime;
};

export const extractToken = (): string | null => {
  const jwtToken = localStorage.getItem('jwtToken');
  return jwtToken;
};
