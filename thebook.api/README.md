# The Book I Never Wrote - API Implementation

## Overview

This project implements a user authentication system with MySQL database for "The Book I Never Wrote" application. The API provides user registration, login, and profile management functionality with JWT-based authentication.

## Features Implemented

### ✅ User Authentication System
- **User Registration**: Create new user accounts with validation
- **User Login**: Authenticate users with username/email and password
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Secure password storage using BCrypt
- **User Profile**: Retrieve user information

### ✅ Database Integration
- **MySQL Database**: Full integration with MySQL using Entity Framework Core
- **User Model**: Complete user entity with all necessary fields
- **Migrations**: Database schema management with Entity Framework migrations
- **Unique Constraints**: Username and email uniqueness enforced at database level

### ✅ Security Features
- **BCrypt Password Hashing**: Secure password storage with salt
- **JWT Tokens**: 7-day expiration with configurable secret key
- **CORS Configuration**: Properly configured for React frontend
- **Input Validation**: Comprehensive DTO validation

## Project Structure

```
thebook.api/
├── Controllers/
│   └── UserController.cs          # User authentication endpoints
├── Data/
│   ├── BookDbContext.cs          # Entity Framework DbContext
│   └── DesignTimeDbContextFactory.cs # Design-time DB context
├── Models/
│   ├── User.cs                   # User entity model
│   └── UserDtos.cs              # Data transfer objects
├── Services/
│   ├── AuthService.cs           # JWT and password services
│   └── UserService.cs           # User business logic
├── Migrations/                  # Entity Framework migrations
├── appsettings.json            # Configuration settings
└── Program.cs                  # Application startup
```

## API Endpoints

### Authentication Endpoints

#### POST `/api/user/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePassword123",
  "fullName": "John Doe",
  "birthYear": 1990,
  "bio": "A passionate writer"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "birthYear": 1990,
    "bio": "A passionate writer",
    "bookId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "expiresAt": "2024-01-08T00:00:00Z"
}
```

#### POST `/api/user/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "usernameOrEmail": "johndoe",
  "password": "SecurePassword123"
}
```

**Response:** Same format as registration

#### GET `/api/user/profile`
Get the current user's profile (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "fullName": "John Doe",
  "birthYear": 1990,
  "bio": "A passionate writer",
  "bookId": "550e8400-e29b-41d4-a716-446655440000",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### GET `/api/user/{userId}`
Get a user by ID (public endpoint).

## Database Schema

### Users Table
```sql
CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` varchar(100) NOT NULL,
    `Email` varchar(255) NOT NULL,
    `PasswordHash` longtext NOT NULL,
    `FullName` varchar(150) NULL,
    `BirthYear` int NULL,
    `Bio` varchar(1000) NULL,
    `BookId` longtext NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `IsActive` tinyint(1) NOT NULL DEFAULT TRUE,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Users_Username` (`Username`),
    UNIQUE KEY `IX_Users_Email` (`Email`)
);
```

## Setup Instructions

### 1. Database Setup
1. Install MySQL Server
2. Create the database:
   ```sql
   CREATE DATABASE thebook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

### 2. Configuration
1. Update connection string in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=thebook;User=root;Password=yourpassword;"
   }
   ```

2. Update JWT settings (use a secure secret key):
   ```json
   "JwtSettings": {
     "SecretKey": "YourSuperSecretKeyThatIsAtLeast32CharactersLong!",
     "Issuer": "thebook.api",
     "Audience": "thebook.client"
   }
   ```

### 3. Run Migrations
```bash
cd thebook.api
dotnet ef database update
```

### 4. Start the Application
```bash
dotnet run
```

The API will be available at `http://localhost:5031`

## Testing

Use the provided `thebook.api.http` file to test the endpoints with VS Code REST Client extension, or use any HTTP client like Postman.

## Security Considerations

1. **Change JWT Secret**: Update the JWT secret key in production
2. **Database Credentials**: Use environment variables for sensitive data
3. **HTTPS**: Enable HTTPS in production
4. **Password Policy**: Consider implementing stronger password requirements
5. **Rate Limiting**: Add rate limiting for authentication endpoints
6. **Logging**: Add comprehensive logging for security events

## Next Steps

- [ ] Implement password reset functionality
- [ ] Add email verification
- [ ] Implement user roles and permissions
- [ ] Add OAuth providers (Google, Facebook, etc.)
- [ ] Implement refresh tokens
- [ ] Add rate limiting
- [ ] Add comprehensive logging and monitoring
