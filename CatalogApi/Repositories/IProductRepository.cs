using CatalogApi.DTOs;
using CatalogApi.Models;

namespace CatalogApi.Repositories
{
    public interface IProductRepository
    {
        Task<PagedResponse<Product>> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        int? idCategory,
        decimal? priceMin,
        decimal? priceMax,
        bool? active,
        string? sortBy,
        string? sortDir);

        Task<Product?> GetByIdAsync(int id);
        Task<Product> AddAsync(Product product);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
        Task AddRangeAsync(List<Product> products);
        Task RestoreAsync(int id);
    }
}
