using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using thebook.api.Data;
using thebook.api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add Entity Framework
builder.Services.AddDbContext<BookDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    ));

// Add authentication services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
var key = Encoding.ASCII.GetBytes(secretKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "http://localhost:5174") // Vite default port and common React ports
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Use CORS
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();

// Use Authentication and Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// Weather forecast endpoint (keeping for reference)
app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Keep existing book-related endpoints for backward compatibility
app.MapGet("/api/books/{bookId}", (string bookId) =>
{
    // In a real app, this would query a database
    return Results.Ok(new 
    { 
        bookId = bookId,
        chapters = new[]
        {
            new { id = 1, title = "The Prologue: A Letter to the Reader", subtitle = "The truth behind the silence, and the courage it took to break it", year = "childhood" },
            new { id = 2, title = "When I was Just a Name", subtitle = "Before I knew who I was, the world had already started shaping me", year = "childhood" },
            // Add more chapters as needed
        }
    });
})
.WithName("GetBook");

app.MapPost("/api/chapters/{chapterId}/content", (int chapterId, ChapterContentDto contentDto) =>
{
    // In a real app, this would save chapter content to a database
    var content = new 
    { 
        chapterId = chapterId,
        content = contentDto.Content,
        updatedAt = DateTime.UtcNow
    };
    
    return Results.Ok(content);
})
.WithName("SaveChapterContent");

app.MapGet("/api/chapters/{chapterId}/content", (int chapterId) =>
{
    // In a real app, this would query chapter content from a database
    return Results.Ok(new 
    { 
        chapterId = chapterId,
        content = "Sample chapter content...",
        lastUpdated = DateTime.UtcNow
    });
})
.WithName("GetChapterContent");

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}

record UserCreateDto(string Name, int BirthYear, string Bio);
record ChapterContentDto(string Content);
