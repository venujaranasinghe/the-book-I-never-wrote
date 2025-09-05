using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using thebook.api.Models;
using thebook.api.Services;

namespace thebook.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IAuthService _authService;

        public UserController(IUserService userService, IAuthService authService)
        {
            _userService = userService;
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register(UserRegistrationDto registrationDto)
        {
            try
            {
                // Check if username already exists
                if (await _userService.UsernameExistsAsync(registrationDto.Username))
                {
                    return BadRequest(new { message = "Username already exists" });
                }

                // Check if email already exists
                if (await _userService.EmailExistsAsync(registrationDto.Email))
                {
                    return BadRequest(new { message = "Email already exists" });
                }

                // Create the user
                var user = await _userService.CreateUserAsync(registrationDto);

                // Generate JWT token
                var token = _authService.GenerateJwtToken(user);

                var response = new AuthResponseDto
                {
                    Token = token,
                    User = new UserResponseDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        FullName = user.FullName,
                        BirthYear = user.BirthYear,
                        Bio = user.Bio,
                        BookId = user.BookId,
                        CreatedAt = user.CreatedAt
                    },
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during registration", error = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login(UserLoginDto loginDto)
        {
            try
            {
                var user = await _userService.AuthenticateAsync(loginDto.UsernameOrEmail, loginDto.Password);

                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid username/email or password" });
                }

                var token = _authService.GenerateJwtToken(user);

                var response = new AuthResponseDto
                {
                    Token = token,
                    User = new UserResponseDto
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        FullName = user.FullName,
                        BirthYear = user.BirthYear,
                        Bio = user.Bio,
                        BookId = user.BookId,
                        CreatedAt = user.CreatedAt
                    },
                    ExpiresAt = DateTime.UtcNow.AddDays(7)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login", error = ex.Message });
            }
        }

        [HttpGet("profile")]
        [Authorize]
        public async Task<ActionResult<UserResponseDto>> GetProfile()
        {
            try
            {
                var userIdClaim = User.FindFirst("userId")?.Value;
                if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var userResponse = new UserResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FullName = user.FullName,
                    BirthYear = user.BirthYear,
                    Bio = user.Bio,
                    BookId = user.BookId,
                    CreatedAt = user.CreatedAt
                };

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching profile", error = ex.Message });
            }
        }

        [HttpGet("{userId}")]
        public async Task<ActionResult<UserResponseDto>> GetUser(int userId)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                {
                    return NotFound(new { message = "User not found" });
                }

                var userResponse = new UserResponseDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    FullName = user.FullName,
                    BirthYear = user.BirthYear,
                    Bio = user.Bio,
                    BookId = user.BookId,
                    CreatedAt = user.CreatedAt
                };

                return Ok(userResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching user", error = ex.Message });
            }
        }
    }
}
