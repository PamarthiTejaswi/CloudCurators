using HotelBookingWebsite.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace HotelBookingWebsite.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<Booking> Bookings { get; set; }
    }
}