import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { Transaction } from "../../entities/Transaction";
import { PrismaClient } from "@prisma/client";
/**
 * Implements the transaction repository using Prisma.
 */
export class PrismaTransactionRepository implements ITransactionRepository {
  private prisma: PrismaClient;

  /**
   * Constructs a new PrismaTransactionRepository instance.
   */
  constructor() {
    this.prisma = new PrismaClient();
  }

  /**
   * Creates a new transaction in the repository.
   * @param transaction - The transaction object to create.
   * @returns A Promise that resolves to the created Transaction object.
   */
  async createTransaction(transaction: Transaction): Promise<Transaction> {
    const newTransaction = await this.prisma.transaction.create({
      data: {
        type: transaction.type,
        details: transaction.details,
        userId: transaction.userId,
        createdAt: transaction.createdAt,
      },
    });
    return new Transaction(
      newTransaction.id,
      newTransaction.type,
      newTransaction.details,
      newTransaction.userId,
      newTransaction.createdAt
    );
  }

  /**
   * Retrieves all transactions from the repository.
   * @returns A Promise that resolves to an array of Transaction objects.
   */
  async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this.prisma.transaction.findMany();
    return transactions.map(
      (transaction: Transaction) =>
        new Transaction(
          transaction.id,
          transaction.type,
          transaction.details ?? null,
          transaction.userId ?? null,
          transaction.createdAt
        )
    );
  }
}
