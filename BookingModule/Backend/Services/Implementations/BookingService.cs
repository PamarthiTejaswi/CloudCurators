using HotelBookingWebsite.Data;
using HotelBookingWebsite.DTOs.Bookings;
using HotelBookingWebsite.Helpers;
using HotelBookingWebsite.Models;
using HotelBookingWebsite.Repositories.Interfaces;
using HotelBookingWebsite.Services.Interfaces;

namespace HotelBookingWebsite.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        // Create Booking (Simplified)
        public async Task<BookingResponseDto> CreateBooking(int userId, CreateBookingDto dto)
        {
            //  Basic validation
            if (dto.FromDate >= dto.ToDate)
                throw new Exception("Invalid date range");

            // Calculate total price
            var totalAmount = PriceCalculator.CalculateTotalPrice(
                dto.PricePerNight,
                dto.FromDate,
                dto.ToDate
            );

            //  Create booking entity
            var booking = new Booking
            {
                UserId = userId,
                RoomId = dto.RoomId, // just storing ID (no validation)
                FromDate = dto.FromDate,
                ToDate = dto.ToDate,
                TotalAmount = totalAmount,
                Status = "Confirmed"
            };

            //  Save to DB
            var savedBooking = await _bookingRepository.CreateBooking(booking);

            //  Convert to Response DTO
            return new BookingResponseDto
            {
                BookingId = savedBooking.Id,
                RoomId = savedBooking.RoomId,
                FromDate = savedBooking.FromDate,
                ToDate = savedBooking.ToDate,
                TotalAmount = savedBooking.TotalAmount,
                Status = savedBooking.Status
            };
        }

        // Get all bookings for a user
        public async Task<List<BookingResponseDto>> GetUserBookings(int userId)
        {
            var bookings = await _bookingRepository.GetBookingsByUser(userId);

            return bookings.Select(b => new BookingResponseDto
            {
                BookingId = b.Id,
                RoomId = b.RoomId,
                FromDate = b.FromDate,
                ToDate = b.ToDate,
                TotalAmount = b.TotalAmount,
                Status = b.Status
            }).ToList();
        }
    }
}