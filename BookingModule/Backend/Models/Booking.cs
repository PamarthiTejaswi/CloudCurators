namespace HotelBookingWebsite.Models
{
    public class Booking
    {
        public int Id { get; set; }

        public int UserId { get; set; }   // From Auth module
        public int RoomId { get; set; }   // From Room module

        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "Confirmed";
    }
}