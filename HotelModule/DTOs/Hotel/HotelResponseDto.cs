namespace HotelBookingWebsite.DTOs.Hotel
{
	public class HotelResponseDto
	{
		public int Id { get; set; }
		public string Name { get; set; } = string.Empty;
		public string Location { get; set; } = string.Empty;
		public string Amenities { get; set; } = string.Empty;
	}
}
