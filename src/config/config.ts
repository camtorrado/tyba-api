import dotenv from "dotenv";

/**
 * Load environment variables from the .env file.
 * @description This function initializes environment variables from a .env file using dotenv.
 */
dotenv.config();

/**
 * Configuration object containing application settings.
 * @description This object contains various application settings loaded from environment variables,
 * with default values provided for fallback.
 */
const config = {
  /**
   * Database configuration.
   */
  databases: {
    /**
     * Database URL.
     * @type {string}
     * @default "default_url"
     * @description The URL used to connect to the database. Defaults to "default_url" if not set in the environment variables.
     */
    url: process.env.DATABASE_URL ?? "default_url",
  },

  /**
   * JWT (JSON Web Token) configuration.
   */
  jwt: {
    /**
     * Secret key used for signing and verifying JWTs.
     * @type {string}
     * @default "default_secret"
     * @description The secret key used to sign and verify JSON Web Tokens. Defaults to "default_secret" if not set in the environment variables.
     */
    secret: process.env.JWT_SECRET ?? "default_secret",

    /**
     * Expiration time for access tokens.
     * @type {string}
     * @default "15m"
     * @description The duration for which access tokens are valid. Defaults to "15m" (15 minutes) if not set in the environment variables.
     */
    accessTokenExpireTime: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME ?? "15m",
  },

  /**
   * Here Places API configuration.
   */
  herePlaces: {
    /**
     * API key for Here Places API.
     * @type {string}
     * @default "default_here_api_key"
     * @description The API key used to access the Here Places API. Defaults to "default_here_api_key" if not set in the environment variables.
     */
    apiKey: process.env.HERE_API_KEY ?? "default_here_api_key",
  },
};

export default config;