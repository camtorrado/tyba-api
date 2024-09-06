import { RevokedToken } from "../../entities/RevokedToken";

/**
 * Defines the contract for revoked token repository operations.
 */
export interface IRevokedTokenRepository {
  /**
   * Creates a new revoked token in the repository.
   * @param token - The revoked token object to create.
   * @returns A Promise that resolves to the created RevokedToken object.
   */
  createRevokedToken(token: RevokedToken): Promise<RevokedToken>;

  /**
   * Checks if a token has been revoked.
   * @param token - The token string to check.
   * @returns A Promise that resolves to a boolean indicating whether the token is revoked.
   */
  isTokenRevoked(token: string): Promise<boolean>;
}
