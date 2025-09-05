using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using thebook.api.Data;

namespace thebook.api
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<BookDbContext>
    {
        public BookDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<BookDbContext>();
            
            // Use a dummy connection string for design time
            optionsBuilder.UseMySql(
                "Server=localhost;Database=thebook;User=root;Password=dummypassword;",
                ServerVersion.Parse("8.0.0-mysql")
            );

            return new BookDbContext(optionsBuilder.Options);
        }
    }
}
