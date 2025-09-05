# Database Troubleshooting Guide

## Why There Are No Tables in the SQL Database

The tables don't exist because the Entity Framework migrations haven't been applied to your MySQL database yet. Here's how to fix this:

## Step 1: Verify MySQL is Running

```bash
# Check if MySQL is running
brew services list | grep mysql
# or
sudo systemctl status mysql  # on Linux
```

## Step 2: Create the Database Manually

1. **Connect to MySQL as root:**
   ```bash
   mysql -u root -p
   ```

2. **Create the database:**
   ```sql
   CREATE DATABASE IF NOT EXISTS thebook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   SHOW DATABASES LIKE 'thebook';
   EXIT;
   ```

   **OR use the SQL script I created:**
   ```bash
   mysql -u root -p < setup_database.sql
   ```

## Step 3: Verify Database Connection

Test the connection with this command:
```bash
mysql -u root -p -e "USE thebook; SHOW TABLES;"
```

You should see an empty result (no tables yet), but no connection errors.

## Step 4: Apply Entity Framework Migrations

Once the database exists and you can connect, run:

```bash
cd thebook.api
dotnet ef database update
```

This will create the tables defined in your migrations.

## Step 5: Verify Tables Were Created

```bash
mysql -u root -p -e "USE thebook; SHOW TABLES; DESCRIBE Users;"
```

You should see:
- A `Users` table
- An `__EFMigrationsHistory` table (EF uses this to track migrations)

## Common Issues and Solutions

### Issue 1: "Access denied for user 'root'@'localhost'"
**Solution:** 
- Verify your password is correct
- Make sure MySQL server is running
- Try resetting the root password if needed

### Issue 2: "Unknown database 'thebook'"
**Solution:** 
- The database doesn't exist yet
- Run the CREATE DATABASE command above

### Issue 3: "Can't connect to MySQL server"
**Solution:**
- Start MySQL service: `brew services start mysql`
- Check if MySQL is listening on port 3306: `netstat -an | grep 3306`

### Issue 4: Connection string issues
**Solution:** 
- Verify the connection string format in `appsettings.json`
- Current format: `"Server=localhost;Database=thebook;User=root;Password=Venuja@3355;"`

## Manual Table Creation (If Migrations Don't Work)

If Entity Framework migrations continue to fail, you can create the table manually:

```sql
USE thebook;

CREATE TABLE `Users` (
    `Id` int NOT NULL AUTO_INCREMENT,
    `Username` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
    `Email` varchar(255) CHARACTER SET utf8mb4 NOT NULL,
    `PasswordHash` longtext CHARACTER SET utf8mb4 NOT NULL,
    `FullName` varchar(150) CHARACTER SET utf8mb4 NULL,
    `BirthYear` int NULL,
    `Bio` varchar(1000) CHARACTER SET utf8mb4 NULL,
    `BookId` longtext CHARACTER SET utf8mb4 NULL,
    `CreatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `UpdatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    `IsActive` tinyint(1) NOT NULL DEFAULT TRUE,
    CONSTRAINT `PK_Users` PRIMARY KEY (`Id`),
    UNIQUE KEY `IX_Users_Username` (`Username`),
    UNIQUE KEY `IX_Users_Email` (`Email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `__EFMigrationsHistory` (
    `MigrationId` varchar(150) CHARACTER SET utf8mb4 NOT NULL,
    `ProductVersion` varchar(32) CHARACTER SET utf8mb4 NOT NULL,
    CONSTRAINT `PK___EFMigrationsHistory` PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20250905031843_InitialCreate', '8.0.10');
```

## Next Steps

After fixing the database connection:

1. **Test the API endpoints** using the `thebook.api.http` file
2. **Try registering a user** with a POST request to `/api/user/register`
3. **Verify the user was created** by checking the database:
   ```sql
   USE thebook;
   SELECT * FROM Users;
   ```

## Need Help?

If you're still having issues:
1. Check MySQL error logs: `tail -f /usr/local/var/mysql/*.err` (on macOS with Homebrew)
2. Verify MySQL configuration: `mysql -u root -p -e "SHOW VARIABLES LIKE 'port';"`
3. Test basic MySQL connectivity: `telnet localhost 3306`
