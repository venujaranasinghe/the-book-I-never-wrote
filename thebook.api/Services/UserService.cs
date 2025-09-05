using Microsoft.EntityFrameworkCore;
using thebook.api.Data;
using thebook.api.Models;

namespace thebook.api.Services
{
    public interface IUserService
    {
        Task<User?> GetUserByIdAsync(int id);
        Task<User?> GetUserByUsernameAsync(string username);
        Task<User?> GetUserByEmailAsync(string email);
        Task<User?> GetUserByUsernameOrEmailAsync(string usernameOrEmail);
        Task<User> CreateUserAsync(UserRegistrationDto registrationDto);
        Task<User?> AuthenticateAsync(string usernameOrEmail, string password);
        Task<bool> UsernameExistsAsync(string username);
        Task<bool> EmailExistsAsync(string email);
    }

    public class UserService : IUserService
    {
        private readonly BookDbContext _context;
        private readonly IAuthService _authService;

        public UserService(BookDbContext context, IAuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id && u.IsActive);
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Username == username && u.IsActive);
        }

        public async Task<User?> GetUserByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.IsActive);
        }

        public async Task<User?> GetUserByUsernameOrEmailAsync(string usernameOrEmail)
        {
            return await _context.Users.FirstOrDefaultAsync(u => 
                (u.Username == usernameOrEmail || u.Email == usernameOrEmail) && u.IsActive);
        }

        public async Task<User> CreateUserAsync(UserRegistrationDto registrationDto)
        {
            var user = new User
            {
                Username = registrationDto.Username,
                Email = registrationDto.Email,
                PasswordHash = _authService.HashPassword(registrationDto.Password),
                FullName = registrationDto.FullName,
                BirthYear = registrationDto.BirthYear,
                Bio = registrationDto.Bio,
                BookId = Guid.NewGuid().ToString(), // Generate a unique book ID for each user
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User?> AuthenticateAsync(string usernameOrEmail, string password)
        {
            var user = await GetUserByUsernameOrEmailAsync(usernameOrEmail);
            
            if (user == null || !_authService.VerifyPassword(password, user.PasswordHash))
            {
                return null;
            }

            return user;
        }

        public async Task<bool> UsernameExistsAsync(string username)
        {
            return await _context.Users.AnyAsync(u => u.Username == username);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }
    }
}
