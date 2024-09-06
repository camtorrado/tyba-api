/**
 * Represents a transaction in the system.
 */
export class Transaction {
  /**
   * Constructs a new Transaction instance.
   * @param id - The unique identifier of the transaction.
   * @param type - The type of the transaction (e.g., 'login', 'registration', 'restaurant_query').
   * @param details - Optional details about the transaction.
   * @param userId - The ID of the user associated with the transaction.
   * @param createdAt - The date and time when the transaction was created.
   */
  constructor(
    id: string,
    type: string,
    details: string | null, // Allow null for details
    userId: string | null,  // Allow null for userId
    createdAt: Date
  ) {
    this.id = id;
    this.type = type;
    this.details = details;
    this.userId = userId;
    this.createdAt = createdAt;
  }

  /** The unique identifier of the transaction. */
  id: string;

  /** The type of the transaction. */
  type: string;

  /** Optional details about the transaction. */
  details: string | null; // Allow null for details

  /** The ID of the user associated with the transaction. */
  userId: string | null; // Allow null for userId

  /** The date and time when the transaction was created. */
  createdAt: Date;
}
