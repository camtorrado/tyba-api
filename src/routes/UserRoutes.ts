import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { PrismaUserRepository } from "../repositories/implementations/PrismaUserRepository";
import { PrismaTransactionRepository } from "../repositories/implementations/PrismaTransactionRepository";
import { PrismaRevokedTokenRepository } from "../repositories/implementations/PrismaRevokedTokenRepository";
import { UserService } from "../services/UserService";
import verifyJwt from "../middleware/VerifyJwt";

const router = Router();
const userRepository = new PrismaUserRepository();
const transactionRepository = new PrismaTransactionRepository();
const prismaRevokedTokenRepository = new PrismaRevokedTokenRepository();
const userService = new UserService(
  userRepository,
  transactionRepository,
  prismaRevokedTokenRepository
);
const userController = new UserController(userService);

router.post("/register", (req, res) => userController.register(req, res));
router.post("/login", (req, res) => userController.login(req, res));

// Endpoint to get nearby restaurants (secured by JWT middleware)
router.get("/restaurants", verifyJwt, (req, res) =>
  userController.getRestaurants(req, res)
);

// Endpoint to get all user transactions (secured by JWT middleware)
router.get("/transactions", verifyJwt, (req, res) =>
  userController.getTransactions(req, res)
);

// // Endpoint to log out user (secured by JWT middleware)
router.post("/logout", verifyJwt, (req, res) =>
  userController.logout(req, res)
);

export default router;
