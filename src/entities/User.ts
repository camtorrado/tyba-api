/**
 * Represents a user in the system.
 */
export class User {
  /**
   * Constructs a new User instance.
   * @param id - The unique identifier of the user.
   * @param email - The email address of the user.
   * @param password - The hashed password of the user.
   * @param username - The username of the user.
   * @param createdAt - The date and time when the user was created.
   */
  constructor(
    id: string,
    email: string,
    password: string,
    username: string,
    createdAt: Date
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** The unique identifier of the user. */
  id: string;

  /** The email address of the user. */
  email: string;

  /** The hashed password of the user. */
  password: string;

  /** The username of the user. */
  username: string;

  /** The date and time when the user was created. */
  createdAt: Date;
}