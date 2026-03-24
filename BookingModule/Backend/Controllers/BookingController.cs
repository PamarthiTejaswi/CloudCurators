using HotelBookingWebsite.Data;
using HotelBookingWebsite.DTOs.Bookings;
using HotelBookingWebsite.Services.Interfaces;
using HotelBookingWebsite.Validators;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        //  CREATE BOOKING (No Auth)
        [HttpPost]
        public async Task<IActionResult> CreateBooking(CreateBookingDto dto)
        {
            try
            {
                BookingValidator.Validate(dto);

                int userId = 1; //  temporary static user

                var result = await _bookingService.CreateBooking(userId, dto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //  GET USER BOOKINGS
        [HttpGet("user")]
        public async Task<IActionResult> GetUserBookings()
        {
            try
            {
                int userId = 1; //  temporary static user

                var bookings = await _bookingService.GetUserBookings(userId);

                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET ALL BOOKINGS
        [HttpGet("all")]
        public async Task<IActionResult> GetAllBookings([FromServices] AppDbContext context)
        {
            var bookings = context.Bookings.ToList();
            return Ok(bookings);
        }
    }
}