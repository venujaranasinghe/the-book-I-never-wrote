using thebook.api.Models;

namespace thebook.api.Services
{
    public interface IChapterService
    {
        Task<Chapter> CreateChapterAsync(int userId, ChapterCreateDto chapterDto);
        Task<Chapter?> GetChapterByIdAsync(int chapterId, int userId);
        Task<IEnumerable<ChapterListDto>> GetUserChaptersAsync(int userId);
        Task<Chapter?> UpdateChapterAsync(int chapterId, int userId, ChapterUpdateDto chapterDto);
        Task<bool> DeleteChapterAsync(int chapterId, int userId);
        Task<bool> ReorderChaptersAsync(int userId, Dictionary<int, int> chapterOrders);
        Task<int> GetNextChapterOrderAsync(int userId);
    }
}
