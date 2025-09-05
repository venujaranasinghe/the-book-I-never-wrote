# Database Setup Instructions

## Prerequisites
- MySQL Server installed and running
- MySQL user with database creation permissions

## Database Setup

1. **Create the database:**
   ```sql
   CREATE DATABASE thebook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Create a user (optional, if you want a dedicated user):**
   ```sql
   CREATE USER 'thebook_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON thebook.* TO 'thebook_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Update the connection string:**
   Update the connection string in `appsettings.json` and `appsettings.Development.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=localhost;Database=thebook;User=your_username;Password=your_password;"
   }
   ```

4. **Run the database migrations:**
   ```bash
   dotnet ef database update
   ```

## Security Notes

- **Change the JWT Secret Key**: Update the `JwtSettings:SecretKey` in `appsettings.json` to a secure random string (at least 32 characters)
- **Use environment variables**: For production, consider using environment variables or Azure Key Vault for sensitive configuration
- **Database credentials**: Never commit real database credentials to source control

## API Endpoints

### Authentication
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/user/profile` - Get current user profile (requires authentication)
- `GET /api/user/{userId}` - Get user by ID

### Example Registration Request
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

### Example Login Request
```json
{
  "usernameOrEmail": "johndoe",
  "password": "SecurePassword123"
}
```

## Testing the API

You can test the API using the provided HTTP file: `thebook.api.http`

The API will return JWT tokens that expire in 7 days. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```
