using HotelBookingWebsite.Models;

namespace HotelBookingWebsite.Repositories.Interfaces
{
    public interface IBookingRepository
    {
        Task<Booking> CreateBooking(Booking booking);
        Task<List<Booking>> GetBookingsByUser(int userId);
        Task<int> GetBookingCount(int roomId, DateTime fromDate, DateTime toDate);
    }
}