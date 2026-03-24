using HotelBookingWebsite.Data;
using HotelBookingWebsite.Models;
using HotelBookingWebsite.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingWebsite.Repositories.Implementations
{
    public class BookingRepository : IBookingRepository
    {
        private readonly AppDbContext _context;

        public BookingRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Booking> CreateBooking(Booking booking)
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }

        public async Task<List<Booking>> GetBookingsByUser(int userId)
        {
            return await _context.Bookings
                .Where(b => b.UserId == userId)
                .ToListAsync();
        }

        public async Task<int> GetBookingCount(int roomId, DateTime fromDate, DateTime toDate)
        {
            return await _context.Bookings
                .Where(b => b.RoomId == roomId &&
                       b.Status == "Confirmed" &&
                       (
                           (fromDate >= b.FromDate && fromDate < b.ToDate) ||
                           (toDate > b.FromDate && toDate <= b.ToDate) ||
                           (fromDate <= b.FromDate && toDate >= b.ToDate)
                       ))
                .CountAsync();
        }
    }
}