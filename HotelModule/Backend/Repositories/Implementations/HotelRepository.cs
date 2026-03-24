//using HotelBookingWebsite.Data;
using HotelBookingWebsite.Models;
using HotelBookingWebsite.Repositories;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingWebsite.Repositories
{
	public class HotelRepository : IHotelRepository
	{
		private readonly AppDbContext _context;

		public HotelRepository(AppDbContext context)
		{
			_context = context;
		}

		public async Task<IEnumerable<Hotel>> GetAllAsync()
		{
			return await _context.Hotels.ToListAsync();
		}

		public async Task<Hotel?> GetByIdAsync(int id)
		{
			return await _context.Hotels.FindAsync(id);
		}

		public async Task AddAsync(Hotel hotel)
		{
			await _context.Hotels.AddAsync(hotel);
			await _context.SaveChangesAsync();
		}

		public async Task UpdateAsync(Hotel hotel)
		{
			_context.Hotels.Update(hotel);
			await _context.SaveChangesAsync();
		}

		public async Task DeleteAsync(int id)
		{
			var hotel = await _context.Hotels.FindAsync(id);
			if (hotel != null)
			{
				_context.Hotels.Remove(hotel);
				await _context.SaveChangesAsync();
			}
		}

		// ✅ SEARCH LOGIC
		public async Task<IEnumerable<Hotel>> SearchAsync(string? query)
		{
			var data = _context.Hotels.AsQueryable();

			if (!string.IsNullOrEmpty(query))
			{
				data = data.Where(h =>
					h.Name.Contains(query) ||
					h.Location.Contains(query) ||
					h.Id.ToString() == query
				);
			}

			return await data.ToListAsync();
		}
	}
}