using Microsoft.EntityFrameworkCore;
using thebook.api.Models;

namespace thebook.api.Data
{
    public class BookDbContext : DbContext
    {
        public BookDbContext(DbContextOptions<BookDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Chapter> Chapters { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                
                // Configure datetime properties for MySQL compatibility
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("NOW()");
                
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("NOW() ON UPDATE NOW()");
            });

            // Configure Chapter entity
            modelBuilder.Entity<Chapter>(entity =>
            {
                entity.HasIndex(e => new { e.UserId, e.Order });
                
                // Configure datetime properties for MySQL compatibility
                entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("NOW()");
                
                entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("NOW() ON UPDATE NOW()");

                // Configure the relationship
                entity.HasOne(c => c.User)
                    .WithMany(u => u.Chapters)
                    .HasForeignKey(c => c.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
