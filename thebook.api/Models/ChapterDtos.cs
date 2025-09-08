using System.ComponentModel.DataAnnotations;

namespace thebook.api.Models
{
    public class ChapterCreateDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [StringLength(300)]
        public string? Subtitle { get; set; }

        [Required]
        [StringLength(50)]
        public string Year { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public string? Footnotes { get; set; }

        public int Order { get; set; } = 0;
    }

    public class ChapterUpdateDto
    {
        [StringLength(200)]
        public string? Title { get; set; }

        [StringLength(300)]
        public string? Subtitle { get; set; }

        [StringLength(50)]
        public string? Year { get; set; }

        public string? Content { get; set; }

        public string? Footnotes { get; set; }

        public int? Order { get; set; }
    }

    public class ChapterResponseDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string Year { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Footnotes { get; set; }
        public int UserId { get; set; }
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class ChapterListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Subtitle { get; set; }
        public string Year { get; set; } = string.Empty;
        public string ContentPreview { get; set; } = string.Empty;
        public int Order { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
