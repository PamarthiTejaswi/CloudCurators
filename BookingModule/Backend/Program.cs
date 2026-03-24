using HotelBookingWebsite.Data;
using HotelBookingWebsite.Repositories.Implementations;
using HotelBookingWebsite.Repositories.Interfaces;
using HotelBookingWebsite.Services.Implementations;
using HotelBookingWebsite.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

//  DATABASE CONNECTION
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("Hotel")));

//  CORS (Allow Angular Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        policy =>
        {
            policy.WithOrigins("http://localhost:4200")
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

//  DEPENDENCY INJECTION
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBookingService, BookingService>();

//  CONTROLLERS
builder.Services.AddControllers();

//  SWAGGER
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

//  MIDDLEWARE PIPELINE
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//  IMPORTANT: Enable CORS BEFORE controllers
app.UseCors("AllowAngular");

//  MAP CONTROLLERS
app.MapControllers();

app.Run();