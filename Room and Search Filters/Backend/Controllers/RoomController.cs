using HotelBookingWebsite.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _service;

        public RoomController(IRoomService service)
        {
            _service = service;
        }

        [HttpGet("hotel/{hotelId}")]
        public async Task<IActionResult> GetByHotel(int hotelId)
        {
            if (hotelId <= 0)
                return BadRequest("Invalid hotel ID");

            var rooms = await _service.GetRoomsByHotel(hotelId);

            if (rooms == null || rooms.Count == 0)
                return NotFound("No rooms available");

            return Ok(rooms);
        }
    }
}