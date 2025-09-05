using Microsoft.EntityFrameworkCore;
using thebook.api.Data;

namespace thebook.api
{
    public class DatabaseTestService
    {
        public static async Task TestDatabaseConnection(string connectionString)
        {
            try
            {
                var optionsBuilder = new DbContextOptionsBuilder<BookDbContext>();
                optionsBuilder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

                using var context = new BookDbContext(optionsBuilder.Options);
                
                Console.WriteLine("Testing database connection...");
                
                // Test if we can connect
                var canConnect = await context.Database.CanConnectAsync();
                Console.WriteLine($"Can connect to database: {canConnect}");
                
                if (!canConnect)
                {
                    Console.WriteLine("Cannot connect to database. Please check:");
                    Console.WriteLine("1. MySQL server is running");
                    Console.WriteLine("2. Database 'thebook' exists");
                    Console.WriteLine("3. Connection string is correct");
                    Console.WriteLine("4. User has proper permissions");
                    return;
                }

                // Check if database exists and has tables
                var tableCount = await context.Database.SqlQueryRaw<int>("SELECT COUNT(*) as Value FROM information_schema.tables WHERE table_schema = 'thebook'").FirstOrDefaultAsync();
                Console.WriteLine($"Number of tables in database: {tableCount}");
                
                if (tableCount == 0)
                {
                    Console.WriteLine("Database exists but has no tables. Run migrations with: dotnet ef database update");
                }
                else
                {
                    Console.WriteLine("Database and tables exist!");
                    
                    // Check if Users table exists
                    var usersTableExists = await context.Database.SqlQueryRaw<int>("SELECT COUNT(*) as Value FROM information_schema.tables WHERE table_schema = 'thebook' AND table_name = 'Users'").FirstOrDefaultAsync();
                    Console.WriteLine($"Users table exists: {usersTableExists > 0}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error testing database connection: {ex.Message}");
                Console.WriteLine($"Inner exception: {ex.InnerException?.Message}");
            }
        }
    }
}
