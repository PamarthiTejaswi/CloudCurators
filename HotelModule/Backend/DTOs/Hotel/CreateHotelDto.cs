namespace HotelBookingWebsite.DTOs.Hotel
{
	public class CreateHotelDto
	{
		public string Name { get; set; } = string.Empty;
		public string Location { get; set; } = string.Empty;
		public string Description { get; set; } = string.Empty;
		public string Amenities { get; set; } = string.Empty;
	}
}
