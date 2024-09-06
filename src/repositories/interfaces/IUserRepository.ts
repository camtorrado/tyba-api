import { User } from "../../entities/User";

/**
 * Defines the contract for user repository operations.
 */
export interface IUserRepository {
  /**
   * Creates a new user in the repository.
   * @param user - The user object to create.
   * @returns A Promise that resolves to the created User object.
   */
  createUser(user: User): Promise<User>;

  /**
   * Finds a user by their email address.
   * @param email - The email address to search for.
   * @returns A Promise that resolves to the User object if found, or null if not found.
   */
  findUserByEmail(email: string): Promise<User | null>;
}
