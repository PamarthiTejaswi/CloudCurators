namespace HotelBookingWebsite.Helpers
{
    public class PriceCalculator
    {
        public static decimal CalculateTotalPrice(decimal pricePerNight, DateTime fromDate, DateTime toDate)
        {
            int totalDays = (toDate - fromDate).Days;

            if (totalDays <= 0)
                throw new Exception("Invalid booking dates");

            return pricePerNight * totalDays;
        }
    }
}