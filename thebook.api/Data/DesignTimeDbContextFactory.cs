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
            
            // Use the same connection string as in appsettings
            optionsBuilder.UseMySql(
                "Server=localhost;Database=thebook;Uid=thebook_user;Pwd=thebook_password;AllowPublicKeyRetrieval=true;SslMode=none;",
                ServerVersion.AutoDetect("Server=localhost;Database=thebook;Uid=thebook_user;Pwd=thebook_password;AllowPublicKeyRetrieval=true;SslMode=none;")
            );

            return new BookDbContext(optionsBuilder.Options);
        }
    }
}
