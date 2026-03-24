
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using HotelBookingWebsite.Models;
namespace HotelBookingWebsite.Data

{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Name = "Admin",
                    Email = "admin@gmail.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                    Role = "Admin",
                    CreatedAt = DateTime.UtcNow
                }
            );
        }
    }
}