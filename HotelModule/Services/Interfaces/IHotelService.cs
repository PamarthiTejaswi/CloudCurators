using HotelBookingWebsite.Models;

namespace HotelBookingWebsite.Services
{
	public interface IHotelService
	{
		Task<IEnumerable<Hotel>> GetAllAsync();
		Task<Hotel?> GetByIdAsync(int id);
		Task AddAsync(Hotel hotel);
		Task UpdateAsync(Hotel hotel);
		Task DeleteAsync(int id);

		Task<IEnumerable<Hotel>> SearchAsync(string? query);
	}
}