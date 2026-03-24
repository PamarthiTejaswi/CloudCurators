namespace HotelBookingWebsite.DTOs.Bookings
{
    public class CreateBookingDto
    {
        public int RoomId { get; set; }
        public decimal PricePerNight { get; set; }

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
    }
}