export const isJWTTokenValid = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;

  const payload = JSON.parse(atob(token.split('.')[1]));
  const expirationTime = payload.exp * 1000;
  return Date.now() < expirationTime;
};
export function decodeJWT(token: string | null) {
  if (!token) return {};
  // Split the JWT token into its three parts
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('Invalid JWT token');
  }

  // Decode the payload part (which is Base64Url encoded)
  const base64Url = parts[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(payload); // Parse the decoded payload
}
export const extractToken = (): string | null => {
  const jwtToken = localStorage.getItem('jwtToken');
  return jwtToken;
};
