var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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

// Book-related endpoints
app.MapGet("/api/users/{userId}", (string userId) =>
{
    // In a real app, this would query a database
    return Results.Ok(new 
    { 
        id = userId,
        name = "Sample User",
        birthYear = 1990,
        bio = "A sample user biography for testing purposes.",
        bookId = Guid.NewGuid().ToString()
    });
})
.WithName("GetUser");

app.MapPost("/api/users", (UserCreateDto userDto) =>
{
    // In a real app, this would save to a database
    var user = new 
    { 
        id = Guid.NewGuid().ToString(),
        name = userDto.Name,
        birthYear = userDto.BirthYear,
        bio = userDto.Bio,
        bookId = Guid.NewGuid().ToString(),
        createdAt = DateTime.UtcNow
    };
    
    return Results.Created($"/api/users/{user.id}", user);
})
.WithName("CreateUser");

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
