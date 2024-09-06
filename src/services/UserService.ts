import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { User } from "../entities/User";
import { ITransactionRepository } from "../repositories/interfaces/ITransactionRepository";
import { Transaction } from "../entities/Transaction";
import { IRevokedTokenRepository } from "../repositories/interfaces/IRevokedTokenRepository";
import { RevokedToken } from "../entities/RevokedToken";
import bcrypt from "bcryptjs";
import { generateJwt } from "./jwtService";
import axios from "axios";
import config from "../config/config";

/**
 * Handles the business logic for user-related operations.
 */
export class UserService {
  private transactionRepository: ITransactionRepository;
  private revokedTokenRepository: IRevokedTokenRepository;
  private userRepository: IUserRepository;

  /**
   * Constructs a new UserService instance.
   * @param userRepository - The user repository implementation.
   * @param transactionRepository - The transaction repository implementation.
   */
  constructor(
    userRepository: IUserRepository,
    transactionRepository: ITransactionRepository,
    revokedTokenRepository: IRevokedTokenRepository
  ) {
    this.transactionRepository = transactionRepository;
    this.revokedTokenRepository = revokedTokenRepository;
    this.userRepository = userRepository;
  }

  /**
   * Registers a new user.
   * @param email - The email of the user to register.
   * @param password - The password of the user to register.
   * @param username - The username of the user to register.
   * @returns A Promise that resolves to the newly created User object.
   * @throws Error if a user with the given email already exists.
   */
  async registerUser(
    email: string,
    password: string,
    username: string
  ): Promise<User> {
    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User("", email, hashedPassword, username, new Date());
    const createdUser = await this.userRepository.createUser(user);

    // Record the registration transaction
    await this.recordTransaction("registration", null, createdUser.id);

    return createdUser;
  }

  /**
   * Authenticates a user and returns a JWT token.
   * @param email - The email of the user to authenticate.
   * @param password - The password of the user to authenticate.
   * @returns A Promise that resolves to a JWT token string.
   * @throws Error if the credentials are invalid.
   */
  async loginUser(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password");
    }

    const token = generateJwt({ id: user.id, email: user.email });

    // Record the login transaction
    await this.recordTransaction("login", null, user.id);

    return token;
  }

  /**
   * Gets coordinates from a city name using the Here API's geocode endpoint.
   * @param city - The name of the city.
   * @returns The latitude and longitude of the city.
   */
  async getCoordinatesFromCity(
    city: string
  ): Promise<{ lat: number; lon: number }> {
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
      city
    )}&apiKey=${config.herePlaces.apiKey}`;

    try {
      const response = await axios.get(url);
      const { items } = response.data;
      if (items.length === 0) {
        throw new Error("No coordinates found for the provided city");
      }

      // Get coordinates from the first result
      const { lat, lng } = items[0].position;
      return { lat, lon: lng };
    } catch (error) {
      console.error("Error fetching coordinates for the city:", error);
      throw new Error("Error fetching city coordinates");
    }
  }

  /**
   * Get restaurants based on city or coordinates.
   * @param locationQuery - The city name or coordinates in the form of latitude and longitude.
   * @param userId - The ID of the user associated with the transaction.
   * @returns A list of nearby restaurants.
   */
  async getNearbyRestaurants(
    locationQuery: {
      city?: string;
      coordinates?: { lat: number; lon: number };
    },
    userId: string | null
  ): Promise<any> {
    let { city, coordinates } = locationQuery;

    // If a city is provided, get coordinates first
    if (city) {
      coordinates = await this.getCoordinatesFromCity(city);
    }

    if (!coordinates) {
      throw new Error("You must provide coordinates or a valid city");
    }

    const { lat, lon } = coordinates;
    const radius = 15000;

    const url = `https://discover.search.hereapi.com/v1/discover?limit=10&apiKey=${config.herePlaces.apiKey}&in=circle:${lat},${lon};r=${radius}&q=restaurant`;

    try {
      const response = await axios.get(url);

      // Record transaction
      await this.recordTransaction(
        "restaurant_query",
        `Query for city: ${city} or coordinates: ${coordinates}`,
        userId
      );

      return response.data.items;
    } catch (error) {
      console.error("Error fetching restaurants from HERE API:", error);
      throw new Error("Failed to fetch restaurants");
    }
  }

  /**
   * Records a new transaction in the database.
   * @param type - The type of the transaction (e.g., 'login', 'registration', 'restaurant_query').
   * @param details - Optional details about the transaction.
   * @param userId - The ID of the user associated with the transaction.
   * @returns A Promise that resolves to the created Transaction object.
   */
  async recordTransaction(
    type: string,
    details: string | null,
    userId: string | null
  ): Promise<Transaction> {
    const transaction = new Transaction("", type, details, userId, new Date());
    return await this.transactionRepository.createTransaction(transaction);
  }

  /**
   * Get all transactions from the repository.
   * @returns A Promise that resolves to a list of transactions.
   */
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.getAllTransactions();
  }

  /**
   * Logs out the user by revoking the provided JWT token.
   * @param token - The JWT token to revoke.
   * @returns A Promise that resolves when the logout is complete.
   */
  async logoutUser(token: string): Promise<void> {
    const revokedToken = new RevokedToken("", token, new Date());
    await this.revokedTokenRepository.createRevokedToken(revokedToken);
  }
}
