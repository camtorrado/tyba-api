import { Request, Response } from "express";
import { UserService } from "../services/UserService";

/**
 * Handles HTTP requests related to user operations.
 */
export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Handles user registration requests.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A Promise that resolves to the Express Response object.
   */
  async register(req: Request, res: Response): Promise<Response> {
    const { email, password, username } = req.body;
    try {
      const user = await this.userService.registerUser(
        email,
        password,
        username
      );
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  /**
   * Handles user login requests.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A Promise that resolves to the Express Response object.
   */
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;
    try {
      const token = await this.userService.loginUser(email, password);
      return res.json({ token });
    } catch (error) {
      return res.status(401).json({
        message: error instanceof Error ? error.message : "An error occurred",
      });
    }
  }

  /**
   * Handles requests to get nearby restaurants based on city or coordinates.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A Promise that resolves to the Express Response object.
   */
  async getRestaurants(req: Request, res: Response): Promise<Response> {
    const { city, lat, lon } = req.query;
    const userId = req.body.jwtPayload?.id || null; // Get userId from jwtPayload

    try {
      let locationQuery: {
        city?: string;
        coordinates?: { lat: number; lon: number };
      } = {};

      if (city) {
        locationQuery.city = String(city);
      } else if (lat && lon) {
        locationQuery.coordinates = {
          lat: parseFloat(String(lat)),
          lon: parseFloat(String(lon)),
        };
      } else {
        return res.status(400).json({
          message: "You must provide either a city or coordinates (lat, lon)",
        });
      }

      const restaurants = await this.userService.getNearbyRestaurants(
        locationQuery,
        userId
      );

      return res.json({ restaurants });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Error fetching restaurants",
      });
    }
  }

  /**
   * Handles requests to get all transactions.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A Promise that resolves to the Express Response object.
   */
  async getTransactions(req: Request, res: Response): Promise<Response> {
    try {
      const transactions = await this.userService.getAllTransactions();
      return res.json({ transactions });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Error fetching transactions",
      });
    }
  }

  /**
   * Handles user logout requests.
   * @param req - The Express request object. Expects an Authorization header with the token.
   * @param res - The Express response object.
   * @returns A Promise that resolves to the Express Response object with a success or error message.
   */
  async logout(req: Request, res: Response): Promise<Response> {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    try {
      await this.userService.logoutUser(token);
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({
          message:
            error instanceof Error ? error.message : "Error during logout",
        });
    }
  }
}