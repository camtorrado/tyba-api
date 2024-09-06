import jwt from "jsonwebtoken";
import config from "../config/config";

/**
 * Generates a JWT with a specific payload.
 * @param payload - Data to be included in the token (e.g., id, email).
 * @returns The generated JWT token.
 */
export const generateJwt = (payload: object): string => {
  const secretKey = config.jwt.secret;
  return jwt.sign(payload, secretKey, {
    expiresIn: config.jwt.accessTokenExpireTime,
  });
};

/**
 * Verifies a JWT and returns the payload if valid.
 * @param token - The JWT token to verify.
 * @returns The decoded payload if the token is valid, or null if invalid.
 */
export const verifyJwt = (token: string): any => {
  const secretKey = config.jwt.secret;
  try {
    return jwt.verify(token, secretKey);
  } catch (err) {
    return null;
  }
};
