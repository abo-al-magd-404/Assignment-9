import { createLoginCredentials } from "../../common/utils/security/token.security.js";

export const profile = async (user) => {
  return user;
};

export const RotateToken = async (user, issuer) => {
  return await createLoginCredentials(user, issuer);
};
