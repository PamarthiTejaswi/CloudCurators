using HotelBookingWebsite.Data;
using HotelBookingWebsite.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ✅ Add Controllers
builder.Services.AddControllers();

// ✅ CORS Configuration (ADD THIS)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
                "http://localhost:4200",      // Angular Frontend
                "http://localhost:3000",      // Alternative frontend port
                "https://localhost:4200",     // HTTPS variant
                "https://localhost:7266"      // Backend HTTPS
            )
            .AllowAnyMethod()                 // GET, POST, PUT, DELETE, etc.
            .AllowAnyHeader()                 // Allow all headers
            .AllowCredentials();              // Allow cookies/credentials
    });
});

// ✅ Swagger + JWT Authorization Support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    // 🔐 Add JWT Authentication to Swagger
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// ✅ Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ JWT Service
builder.Services.AddScoped<JwtService>();

// 🔐 JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
    var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };
});

var app = builder.Build();

// ✅ Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 🔐 CORS MIDDLEWARE - IMPORTANT: Add this BEFORE Authentication
app.UseCors("AllowFrontend");

// 🔐 ORDER IS VERY IMPORTANT
app.UseAuthentication();   // FIRST
app.UseAuthorization();    // SECOND

app.MapControllers();

app.Run();