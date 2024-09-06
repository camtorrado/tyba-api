import { IUserRepository } from "../interfaces/IUserRepository";
import { User } from "../../entities/User";
import { PrismaClient } from "@prisma/client";

/**
 * Implements the IUserRepository interface using Prisma.
 */
export class PrismaUserRepository implements IUserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Creates a new user in the database.
   * @param user - The user object to create.
   * @returns A Promise that resolves to the created User object.
   */
  async createUser(user: User): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        username: user.username,
        createdAt: user.createdAt,
      },
    });
    return new User(
      newUser.id,
      newUser.email,
      newUser.password,
      newUser.username,
      newUser.createdAt
    );
  }

  /**
   * Finds a user by their email address in the database.
   * @param email - The email address to search for.
   * @returns A Promise that resolves to the User object if found, or null if not found.
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user
      ? new User(
          user.id,
          user.email,
          user.password,
          user.username,
          user.createdAt
        )
      : null;
  }
}
