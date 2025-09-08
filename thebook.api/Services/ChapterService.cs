using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using thebook.api.Data;
using thebook.api.Models;

namespace thebook.api.Services
{
    public class ChapterService : IChapterService
    {
        private readonly BookDbContext _context;

        public ChapterService(BookDbContext context)
        {
            _context = context;
        }

        public async Task<Chapter> CreateChapterAsync(int userId, ChapterCreateDto chapterDto)
        {
            // If no order is specified, get the next available order
            if (chapterDto.Order == 0)
            {
                chapterDto.Order = await GetNextChapterOrderAsync(userId);
            }

            var chapter = new Chapter
            {
                Title = chapterDto.Title,
                Subtitle = chapterDto.Subtitle,
                Year = chapterDto.Year,
                Content = chapterDto.Content,
                Footnotes = chapterDto.Footnotes,
                UserId = userId,
                Order = chapterDto.Order,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Chapters.Add(chapter);
            await _context.SaveChangesAsync();

            return chapter;
        }

        public async Task<Chapter?> GetChapterByIdAsync(int chapterId, int userId)
        {
            return await _context.Chapters
                .Where(c => c.Id == chapterId && c.UserId == userId && c.IsActive)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<ChapterListDto>> GetUserChaptersAsync(int userId)
        {
            var chapters = await _context.Chapters
                .Where(c => c.UserId == userId && c.IsActive)
                .OrderBy(c => c.Order)
                .ThenBy(c => c.CreatedAt)
                .Select(c => new ChapterListDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Subtitle = c.Subtitle,
                    Year = c.Year,
                    ContentPreview = StripHtmlAndTruncate(c.Content, 150),
                    Order = c.Order,
                    CreatedAt = c.CreatedAt,
                    UpdatedAt = c.UpdatedAt
                })
                .ToListAsync();

            return chapters;
        }

        public async Task<Chapter?> UpdateChapterAsync(int chapterId, int userId, ChapterUpdateDto chapterDto)
        {
            var chapter = await _context.Chapters
                .Where(c => c.Id == chapterId && c.UserId == userId && c.IsActive)
                .FirstOrDefaultAsync();

            if (chapter == null)
                return null;

            // Update only provided fields
            if (!string.IsNullOrEmpty(chapterDto.Title))
                chapter.Title = chapterDto.Title;

            if (chapterDto.Subtitle != null)
                chapter.Subtitle = chapterDto.Subtitle;

            if (!string.IsNullOrEmpty(chapterDto.Year))
                chapter.Year = chapterDto.Year;

            if (chapterDto.Content != null)
                chapter.Content = chapterDto.Content;

            if (chapterDto.Footnotes != null)
                chapter.Footnotes = chapterDto.Footnotes;

            if (chapterDto.Order.HasValue)
                chapter.Order = chapterDto.Order.Value;

            chapter.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return chapter;
        }

        public async Task<bool> DeleteChapterAsync(int chapterId, int userId)
        {
            var chapter = await _context.Chapters
                .Where(c => c.Id == chapterId && c.UserId == userId && c.IsActive)
                .FirstOrDefaultAsync();

            if (chapter == null)
                return false;

            // Soft delete
            chapter.IsActive = false;
            chapter.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ReorderChaptersAsync(int userId, Dictionary<int, int> chapterOrders)
        {
            var chapters = await _context.Chapters
                .Where(c => c.UserId == userId && c.IsActive && chapterOrders.Keys.Contains(c.Id))
                .ToListAsync();

            foreach (var chapter in chapters)
            {
                if (chapterOrders.TryGetValue(chapter.Id, out int newOrder))
                {
                    chapter.Order = newOrder;
                    chapter.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<int> GetNextChapterOrderAsync(int userId)
        {
            var maxOrder = await _context.Chapters
                .Where(c => c.UserId == userId && c.IsActive)
                .MaxAsync(c => (int?)c.Order) ?? 0;

            return maxOrder + 1;
        }

        private static string StripHtmlAndTruncate(string htmlContent, int maxLength)
        {
            if (string.IsNullOrEmpty(htmlContent))
                return string.Empty;

            // Remove HTML tags
            var plainText = Regex.Replace(htmlContent, "<.*?>", string.Empty);
            
            // Decode HTML entities
            plainText = System.Net.WebUtility.HtmlDecode(plainText);
            
            // Truncate and add ellipsis if needed
            if (plainText.Length <= maxLength)
                return plainText;

            return plainText.Substring(0, maxLength) + "...";
        }
    }
}
