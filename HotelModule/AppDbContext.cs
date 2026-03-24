using Microsoft.EntityFrameworkCore;
using HotelBookingWebsite.Models;

namespace HotelBookingWebsite
{
	public class AppDbContext : DbContext
	{
		public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

		public DbSet<User> Users { get; set; }
		public DbSet<Hotel> Hotels { get; set; }
	}
}