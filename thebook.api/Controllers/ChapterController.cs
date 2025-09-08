using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using thebook.api.Models;
using thebook.api.Services;

namespace thebook.api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ChapterController : ControllerBase
    {
        private readonly IChapterService _chapterService;

        public ChapterController(IChapterService chapterService)
        {
            _chapterService = chapterService;
        }

        [HttpPost]
        public async Task<ActionResult<ChapterResponseDto>> CreateChapter(ChapterCreateDto chapterDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Invalid token" });

                var chapter = await _chapterService.CreateChapterAsync(userId.Value, chapterDto);

                var response = new ChapterResponseDto
                {
                    Id = chapter.Id,
                    Title = chapter.Title,
                    Subtitle = chapter.Subtitle,
                    Year = chapter.Year,
                    Content = chapter.Content,
                    Footnotes = chapter.Footnotes,
                    UserId = chapter.UserId,
                    Order = chapter.Order,
                    CreatedAt = chapter.CreatedAt,
                    UpdatedAt = chapter.UpdatedAt
                };

                return CreatedAtAction(nameof(GetChapter), new { id = chapter.Id }, response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the chapter", error = ex.Message });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChapterListDto>>> GetUserChapters()
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Invalid token" });

                var chapters = await _chapterService.GetUserChaptersAsync(userId.Value);
                return Ok(chapters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching chapters", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChapterResponseDto>> GetChapter(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Invalid token" });

                var chapter = await _chapterService.GetChapterByIdAsync(id, userId.Value);
                if (chapter == null)
                    return NotFound(new { message = "Chapter not found" });

                var response = new ChapterResponseDto
                {
                    Id = chapter.Id,
                    Title = chapter.Title,
                    Subtitle = chapter.Subtitle,
                    Year = chapter.Year,
                    Content = chapter.Content,
                    Footnotes = chapter.Footnotes,
                    UserId = chapter.UserId,
                    Order = chapter.Order,
                    CreatedAt = chapter.CreatedAt,
                    UpdatedAt = chapter.UpdatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching the chapter", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ChapterResponseDto>> UpdateChapter(int id, ChapterUpdateDto chapterDto)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Invalid token" });

                var chapter = await _chapterService.UpdateChapterAsync(id, userId.Value, chapterDto);
                if (chapter == null)
                    return NotFound(new { message = "Chapter not found" });

                var response = new ChapterResponseDto
                {
                    Id = chapter.Id,
                    Title = chapter.Title,
                    Subtitle = chapter.Subtitle,
                    Year = chapter.Year,
                    Content = chapter.Content,
                    Footnotes = chapter.Footnotes,
                    UserId = chapter.UserId,
                    Order = chapter.Order,
                    CreatedAt = chapter.CreatedAt,
                    UpdatedAt = chapter.UpdatedAt
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the chapter", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteChapter(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Invalid token" });

                var success = await _chapterService.DeleteChapterAsync(id, userId.Value);
                if (!success)
                    return NotFound(new { message = "Chapter not found" });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the chapter", error = ex.Message });
            }
        }

        [HttpPost("reorder")]
        public async Task<ActionResult> ReorderChapters([FromBody] Dictionary<int, int> chapterOrders)
        {
            try
            {
                var userId = GetCurrentUserId();
                if (userId == null)
                    return Unauthorized(new { message = "Invalid token" });

                var success = await _chapterService.ReorderChaptersAsync(userId.Value, chapterOrders);
                if (!success)
                    return BadRequest(new { message = "Failed to reorder chapters" });

                return Ok(new { message = "Chapters reordered successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while reordering chapters", error = ex.Message });
            }
        }

        [HttpGet("user/{userId}")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<ChapterListDto>>> GetPublicUserChapters(int userId)
        {
            try
            {
                var chapters = await _chapterService.GetUserChaptersAsync(userId);
                return Ok(chapters);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while fetching chapters", error = ex.Message });
            }
        }

        private int? GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (userIdClaim == null || !int.TryParse(userIdClaim, out int userId))
                return null;
            return userId;
        }
    }
}
