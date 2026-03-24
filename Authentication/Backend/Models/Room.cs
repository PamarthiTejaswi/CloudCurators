using HotelBookingWebsite.Models;
namespace HotelBookingWebsite.Models
{
    public class Room
    {
        public int Id { get; set; }

        public int HotelId { get; set; }
        public Hotel? Hotel { get; set; }
        

        public string RoomType { get; set; } = string.Empty;
        public decimal PricePerNight { get; set; }
        public int TotalRooms { get; set; }
        public int MaxGuests { get; set; }
    }
}