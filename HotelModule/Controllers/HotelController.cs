using HotelBookingWebsite.Models;
using HotelBookingWebsite.Services;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingWebsite.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class HotelController : ControllerBase
	{
		private readonly IHotelService _service;

		public HotelController(IHotelService service)
		{
			_service = service;
		}

		// ✅ GET ALL HOTELS
		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var hotels = await _service.GetAllAsync();   
			return Ok(hotels);
		}

		// ✅ GET HOTEL BY ID
		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(int id)
		{
			var hotel = await _service.GetByIdAsync(id);   

			if (hotel == null)
				return NotFound("Hotel not found");

			return Ok(hotel);
		}

		
		// ✅ UPDATE HOTEL
		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, [FromBody] Hotel hotel)
		{
			var existing = await _service.GetByIdAsync(id);

			if (existing == null)
				return NotFound("Hotel not found");

			// update fields
			existing.Name = hotel.Name;
			existing.Location = hotel.Location;
			existing.Description = hotel.Description;
			existing.Amenities = hotel.Amenities;

			await _service.UpdateAsync(existing);   // ✅ FIX

			return Ok("Hotel updated successfully");
		}

		// ✅ DELETE HOTEL
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var existing = await _service.GetByIdAsync(id);

			if (existing == null)
				return NotFound("Hotel not found");

			await _service.DeleteAsync(id);   // ✅ FIX

			return Ok("Hotel deleted successfully");
		}

		// ✅ SEARCH
		[HttpGet("search")]
		public async Task<IActionResult> Search([FromQuery] string? query)
		{
			var result = await _service.SearchAsync(query);
			return Ok(result);
		}
		public class UsersController : ControllerBase
		{
			[HttpGet]
			public IActionResult GetUsers()
			{
				var users = new List<string> { "Vineela", "John" };
				return Ok(users);
			}
		}
	}
}