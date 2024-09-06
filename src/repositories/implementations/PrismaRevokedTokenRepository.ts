import { PrismaClient } from "@prisma/client";
import { IRevokedTokenRepository } from "../interfaces/IRevokedTokenRepository";
import { RevokedToken } from "../../entities/RevokedToken";

/**
 * Implements the IRevokedTokenRepository interface using Prisma.
 */
export class PrismaRevokedTokenRepository implements IRevokedTokenRepository {
  private prisma: PrismaClient;

  /**
   * Constructs a new PrismaRevokedTokenRepository instance and initializes the PrismaClient.
   */
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Creates a new revoked token in the repository.
   * @param token - The RevokedToken object to create.
   * @returns A Promise that resolves to the created RevokedToken object.
   */
  async createRevokedToken(token: RevokedToken): Promise<RevokedToken> {
    const newRevokedToken = await this.prisma.revokedToken.create({
      data: {
        token: token.token,
        revokedAt: token.revokedAt, // Updated to use `createdAt` to match field names
      },
    });
    return new RevokedToken(newRevokedToken.id, newRevokedToken.token, newRevokedToken.revokedAt);
  }

  /**
   * Checks if a token has been revoked.
   * @param token - The token string to check.
   * @returns A Promise that resolves to a boolean indicating whether the token is revoked.
   */
  async isTokenRevoked(token: string): Promise<boolean> {
    const revokedToken = await this.prisma.revokedToken.findUnique({
      where: { token },
    });
    return revokedToken !== null;
  }
}