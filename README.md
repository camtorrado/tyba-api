# Tyba API Documentation

## Endpoints

### 1. Register User

- **URL:** `/register`
- **Method:** POST
- **Description:** Register a new user in the system.
- **Request Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@gmail.com",
    "password": "1234"
  }
- **Response:** Returns user registration confirmation.

### 2. User Login

- **URL:** `/login`
- **Method:** POST
- **Description:** Authenticate a user and receive a JWT token.
- **Request Body:**
  ```json
  {
    "email": "test@gmail.com",
    "password": "1234"
  }
- **Response:** Returns JWT token for authenticated user.

### 3. Get Nearby Restaurants

- **URL:** `/restaurants`
- **Method:** GET
- **Description:** Retrieve a list of nearby restaurants.
- **Authentication:** Requires valid JWT token.
- **Response:** Returns a list of restaurant data.

### 4. Get User Transactions

- **URL:** `/transactions`
- **Method:** GET
- **Description:** Retrieve all transactions for the authenticated user.
- **Authentication:** Requires valid JWT token.
**Response: Returns a list of user transactions.

### 5. User Logout

- **URL:** `/logout`
- **Method:** POST
- **Description:** Log out the authenticated user and invalidate the JWT token.
- **Authentication:** Requires valid JWT token.
- **Response:** Confirms successful logout.

### Authentication
All endpoints except `/register` and `/login` require a valid JWT token for authentication. The token should be included in the `Authorization` header of the request as follows:

```
Authorization: Bearer <your_jwt_token>
```

### Error Handling
The API returns appropriate `HTTP` status codes and error messages for various scenarios, such as invalid requests, authentication failures, or server errors.

## Data Models
The API uses the following data models:

#### User

```
model User {
  id           String        @id @default(uuid())
  email        String        @unique @db.VarChar(100)
  password     String        @db.VarChar(255)
  username     String        @unique @db.VarChar(50)
  createdAt    DateTime      @default(now()) @map("created_at")
  transactions Transaction[] @relation("UserTransactions")
  @@map("Users")
}
```

#### Transaction

```
model Transaction {
  id        String   @id @default(cuid())
  type      String   // 'login', 'registration', 'restaurant_query'
  details   String?  // Optional details about the transaction
  userId    String?
  user      User?    @relation("UserTransactions", fields: [userId], references: [id])
  createdAt DateTime @default(now())
}
```

#### RevokedToken

```
model RevokedToken {
  id        String   @id @default(cuid())
  token     String   @unique
  revokedAt DateTime @default(now())
  @@index([token])
}
```

## Notes

- The API uses HTTP/HTTPS for all communication to ensure data security.
- The database is PostgreSQL, managed through Prisma ORM.