using HotelBookingWebsite.DTOs.Bookings;

namespace HotelBookingWebsite.Validators
{
    public class BookingValidator
    {
        public static void Validate(CreateBookingDto dto)
        {
            if (dto.RoomId <= 0)
                throw new Exception("Invalid Room Id");

            if (dto.FromDate >= dto.ToDate)
                throw new Exception("FromDate must be less than ToDate");

            if (dto.FromDate < DateTime.Now.Date)
                throw new Exception("FromDate cannot be in the past");
        }
    }
}