using HotelBookingWebsite.DTOs.Room;
using HotelBookingWebsite.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HotelBookingWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchController : ControllerBase
    {
        private readonly ISearchService _service;

        public SearchController(ISearchService service)
        {
            _service = service;
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search([FromBody] SearchRequestDto dto)
        {
            var result = await _service.Search(dto);
            return Ok(result);
        }
    }
}
