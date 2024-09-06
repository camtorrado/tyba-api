/**
 * Represents a revoked token in the system.
 */
export class RevokedToken {
  /**
   * Constructs a new RevokedToken instance.
   * @param id - The unique identifier of the revoked token.
   * @param token - The actual token string that was revoked.
   * @param revokedAt - The date and time when the token was revoked.
   */
  constructor(id: string, token: string, revokedAt: Date) {
    this.id = id;
    this.token = token;
    this.revokedAt = revokedAt;
  }

  /** The unique identifier of the revoked token. */
  id: string;

  /** The actual token string that was revoked. */
  token: string;

  /** The date and time when the token was revoked. */
  revokedAt: Date;
}
