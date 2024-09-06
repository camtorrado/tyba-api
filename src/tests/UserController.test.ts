import request from "supertest";
import app from "../server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Setup and teardown for tests
beforeAll(async () => {
  // Clean up the users table before running the tests
  await prisma.user.deleteMany();
});

afterAll(async () => {
  // Disconnect Prisma client after tests are done
  await prisma.$disconnect();
});

// Test suite for user registration
describe("User Registration", () => {
  const userData = {
    email: "test@test.com",
    password: "123456",
    username: "Test User"
  };

  it("should register a new user successfully", async () => {
    // Send a POST request to register a new user
    const res = await request(app)
      .post("/api/users/register")
      .send(userData);

    // Expect HTTP status code 201 for successful creation
    expect(res.statusCode).toBe(201);
    // Expect the response body to match the user data
    expect(res.body).toMatchObject({
      email: userData.email,
      username: userData.username
    });
  });

  it("should not register a user with an existing email", async () => {
    // First, register the user
    await request(app)
      .post("/api/users/register")
      .send(userData);

    // Try registering the same user again
    const res = await request(app)
      .post("/api/users/register")
      .send(userData);

    // Expect HTTP status code 400 for bad request due to existing user
    expect(res.statusCode).toBe(400);
    // Expect an error message indicating the user already exists
    expect(res.body).toHaveProperty("message", "User already exists");
  });
});

// Test suite for user authentication
describe("User Authentication", () => {
  const userData = {
    email: "testlogin@test.com",
    password: "123456",
    username: "Test Login User"
  };

  beforeAll(async () => {
    // Register the user before testing login
    await request(app)
      .post("/api/users/register")
      .send(userData);
  });

  it("should login a registered user and return a token", async () => {
    // Send a POST request to log in
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: userData.email,
        password: userData.password
      });

    // Expect HTTP status code 200 for successful login
    expect(res.statusCode).toBe(200);
    // Expect the response to contain a token
    expect(res.body).toHaveProperty("token");
  });

  it("should not login with incorrect password", async () => {
    // Send a POST request to log in with an incorrect password
    const res = await request(app)
      .post("/api/users/login")
      .send({
        email: userData.email,
        password: "wrongpassword"
      });

    // Expect HTTP status code 401 for unauthorized access
    expect(res.statusCode).toBe(401);
    // Expect an error message indicating invalid email or password
    expect(res.body).toHaveProperty("message", "Invalid email or password");
  });
});
