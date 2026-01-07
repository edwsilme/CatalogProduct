namespace CatalogApi.DTOs
{
    public class CategoryUpdateDto
    {
        public int IdCategory { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public bool Active { get; set; }
    }
}