namespace CatalogApi.DTOs
{
    public class ProductUpdateDto
    {
        public int IdProduct { get; set; }
        public int IdCategory { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? Sku { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public bool Active { get; set; }
    }
}
