namespace CatalogApi.DTOs
{
    public class CategoryCreateDto
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
    }
}