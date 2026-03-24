using HotelBookingWebsite.Data;
using HotelBookingWebsite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingWebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")] // 🔐 ONLY ADMIN
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // =========================
        // 🏨 HOTEL CRUD
        // =========================

        [HttpPost("hotel")]
        public async Task<IActionResult> CreateHotel(Hotel hotel)
        {
            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();
            return Ok(hotel);
        }

        [HttpGet("hotels")]
        public async Task<IActionResult> GetHotels()
        {
            return Ok(await _context.Hotels.ToListAsync());
        }

        [HttpPut("hotel/{id}")]
        public async Task<IActionResult> UpdateHotel(int id, Hotel updatedHotel)
        {
            var hotel = await _context.Hotels.FindAsync(id);
            if (hotel == null) return NotFound();

            hotel.Name = updatedHotel.Name;
            hotel.Location = updatedHotel.Location;
            hotel.Description = updatedHotel.Description;
            hotel.Amenities = updatedHotel.Amenities;

            await _context.SaveChangesAsync();
            return Ok(hotel);
        }

        [HttpDelete("hotel/{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            var hotel = await _context.Hotels.FindAsync(id);
            if (hotel == null) return NotFound();

            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();

            return Ok("Hotel deleted");
        }

        // =========================
        // 🛏️ ROOM CRUD
        // =========================

        [HttpPost("room")]
        public async Task<IActionResult> CreateRoom(RoomDTO dto)
        {
            var room = new Room
            {
                HotelId = dto.HotelId,
                RoomType = dto.RoomType,
                PricePerNight = dto.PricePerNight,
                TotalRooms = dto.TotalRooms,
                MaxGuests = dto.MaxGuests
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();

            return Ok(room);
        }

        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms()
        {
            return Ok(await _context.Rooms.Include(r => r.Hotel).ToListAsync());
        }

        [HttpPut("room/{id}")]
        public async Task<IActionResult> UpdateRoom(int id, Room updatedRoom)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            room.RoomType = updatedRoom.RoomType;
            room.PricePerNight = updatedRoom.PricePerNight;
            room.TotalRooms = updatedRoom.TotalRooms;
            room.MaxGuests = updatedRoom.MaxGuests;

            await _context.SaveChangesAsync();
            return Ok(room);
        }

        [HttpDelete("room/{id}")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var room = await _context.Rooms.FindAsync(id);
            if (room == null) return NotFound();

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();

            return Ok("Room deleted");
        }

        // =========================
        // 👤 USER LIST (ADMIN VIEW)
        // =========================

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            return Ok(await _context.Users.ToListAsync());
        }
    }
}