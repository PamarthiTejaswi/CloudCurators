using HotelBookingWebsite.Models;
using HotelBookingWebsite.Repositories;   
using System.Collections.Generic;
using System.Threading.Tasks;

namespace HotelBookingWebsite.Services
{
	public class HotelService : IHotelService
	{
		private readonly IHotelRepository _repo;

		public HotelService(IHotelRepository repo)
		{
			_repo = repo;
		}

		public async Task<IEnumerable<Hotel>> GetAllAsync()
		{
			return await _repo.GetAllAsync();
		}

		public async Task<Hotel?> GetByIdAsync(int id)
		{
			return await _repo.GetByIdAsync(id);
		}

		public async Task AddAsync(Hotel hotel)
		{
			await _repo.AddAsync(hotel);
		}

		public async Task UpdateAsync(Hotel hotel)
		{
			await _repo.UpdateAsync(hotel);
		}

		public async Task DeleteAsync(int id)
		{
			await _repo.DeleteAsync(id);
		}

		// ✅ SEARCH
		public async Task<IEnumerable<Hotel>> SearchAsync(string? query)
		{
			return await _repo.SearchAsync(query);
		}
	}
}