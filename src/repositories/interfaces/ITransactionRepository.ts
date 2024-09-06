import { Transaction } from "../../entities/Transaction";

/**
 * Defines the contract for transaction repository operations.
 */
export interface ITransactionRepository {
  /**
   * Creates a new transaction in the repository.
   * @param transaction - The transaction object to create.
   * @returns A Promise that resolves to the created Transaction object.
   */
  createTransaction(transaction: Transaction): Promise<Transaction>;

  /**
   * Retrieves all transactions from the repository.
   * @returns A Promise that resolves to an array of Transaction objects.
   */
  getAllTransactions(): Promise<Transaction[]>;
}
