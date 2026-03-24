using HotelBookingWebsite.DTOs.Bookings;

namespace HotelBookingWebsite.Services.Interfaces
{
    public interface IBookingService
    {
        Task<BookingResponseDto> CreateBooking(int userId, CreateBookingDto dto);
        Task<List<BookingResponseDto>> GetUserBookings(int userId);
    }
}