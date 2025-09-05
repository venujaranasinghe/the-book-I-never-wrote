-- Run this script in your MySQL client to set up the database
-- You can run this using: mysql -u root -p < setup_database.sql

-- Create the database
CREATE DATABASE IF NOT EXISTS thebook CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the database
USE thebook;

-- Verify the database was created
SELECT 'Database thebook created successfully!' as message;

-- Show databases to confirm
SHOW DATABASES LIKE 'thebook';
