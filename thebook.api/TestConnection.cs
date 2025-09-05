using Microsoft.Extensions.Configuration;
using thebook.api;

namespace thebook.api
{
    public class TestConnection
    {
        public static async Task Main(string[] args)
        {
            // Build configuration
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile("appsettings.Development.json", optional: true)
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            if (string.IsNullOrEmpty(connectionString))
            {
                Console.WriteLine("Connection string not found in appsettings.json");
                return;
            }

            Console.WriteLine($"Testing connection to: {connectionString.Replace("Password=Venuja@3355", "Password=***")}");
            await DatabaseTestService.TestDatabaseConnection(connectionString);
        }
    }
}
