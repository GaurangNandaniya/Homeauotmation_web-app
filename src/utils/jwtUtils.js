import jwtDecode from "jwt-decode";

export const isJWTExpired = (jwt) => {
  const decoded = jwtDecode(jwt);

  return Date.now() >= decoded.exp * 1000;
};
