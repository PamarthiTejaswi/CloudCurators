using HotelBookingWebsite.Data;
using HotelBookingWebsite.DTOs;
using HotelBookingWebsite.Models;
using HotelBookingWebsite.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelBookingWebsite.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwt;

        public AuthController(AppDbContext context, JwtService jwt)
        {
            _context = context;
            _jwt = jwt;
        }

        // ✅ REGISTER (WITH HASHING)
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            // check if user exists
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
                return BadRequest("User already exists");

            // 🔐 hash password
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = hashedPassword,
                Role = "User",
                CreatedAt = DateTime.Now
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok("User Registered");
        }

        // ✅ LOGIN (WITH VERIFY)
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            // ❌ user not found OR password mismatch
            if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            {
                return Unauthorized("Invalid credentials");
            }

            // ✅ generate JWT
            var token = _jwt.GenerateToken(user);

            return Ok(new { token });
        }
    }
}