import express from "express";
import userRoutes from "./routes/UserRoutes";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

/**
 * Configures the Express application and sets up middleware and routes.
 * @description This script initializes the Express application, loads environment variables,
 * and sets up the `/api/users` route for user-related operations.
 */
app.use(express.json());
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;

/**
 * Starts the server and listens on the specified port.
 * @description The server will only start listening if the `NODE_ENV` environment variable is not set to "test".
 * If `NODE_ENV` is "test", the server will not start, which is useful for testing environments.
 */
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;