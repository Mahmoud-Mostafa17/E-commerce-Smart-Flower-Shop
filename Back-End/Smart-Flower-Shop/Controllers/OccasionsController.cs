using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Smart_Flower_Shop.DTO;
using Smart_Flower_Shop.Models;

namespace Smart_Flower_Shop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OccasionsController : ControllerBase
    {
        private readonly ApplicationDbcontext _context;

        public OccasionsController(ApplicationDbcontext context)
        {
            _context = context;
        }

        [HttpGet("GetAllOccasions")]
        public async Task<IActionResult> GetOccasions()
        {
            var occasions = await _context.Occasions
                .Select(o => new OccasionDTO
                {
                    Id = o.OccasionId,
                    Name = o.Name
                })
                .ToListAsync();

            return Ok(occasions);
        }

        [HttpPost("AddOccasion")]
        public async Task<IActionResult> CreateOccasion(OccasionDTO occasionDto)
        {
            if (occasionDto == null || string.IsNullOrWhiteSpace(occasionDto.Name))
            {
                return BadRequest("Invalid occasion data.");
            }

            var newOccasion = new Occasion
            {
                Name = occasionDto.Name
            };

            _context.Occasions.Add(newOccasion);
            await _context.SaveChangesAsync();

            occasionDto.Id = newOccasion.OccasionId;
            return Ok(occasionDto);
        }

        [HttpPut("UpdateOccasion/{id}")]
        public async Task<IActionResult> UpdateOccasion(int id, OccasionDTO occasionDto)
        {
            if (occasionDto == null || id != occasionDto.Id)
            {
                return BadRequest("Invalid occasion data.");
            }

            var occasion = await _context.Occasions.FindAsync(id);
            if (occasion == null)
            {
                return NotFound("Occasion not found.");
            }

            occasion.Name = occasionDto.Name;
            _context.Occasions.Update(occasion);
            await _context.SaveChangesAsync();

            return Ok(occasionDto);
        }

        [HttpDelete("DeleteOccasion/{id}")]
        public async Task<IActionResult> DeleteOccasion(int id)
        {
            var occasion = await _context.Occasions.FindAsync(id);
            if (occasion == null)
            {
                return NotFound("Occasion not found.");
            }

            _context.Occasions.Remove(occasion);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Occasion with ID {id} has been deleted." });
        }
    }
}
