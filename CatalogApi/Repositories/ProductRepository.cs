using CatalogApi.Data;
using CatalogApi.DTOs;
using CatalogApi.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace CatalogApi.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly CatalogDbContext _dbContext;

        public ProductRepository(CatalogDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            if (id <= 0)
            {
                return null;
            }

            var query = _dbContext.Products
                .AsNoTracking()
                .Include(p => p.IdCategoryNavigation)
                .AsQueryable();

            return await query.FirstOrDefaultAsync(p => p.IdProduct == id && p.Active == true);
        }

        public async Task<Product> AddAsync(Product product)
        {
            _dbContext.Products.Add(product);

            await _dbContext.SaveChangesAsync();

            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            _dbContext.Entry(product).State = EntityState.Modified;

            _dbContext.Entry(product).Property(x => x.CreationDate).IsModified = false;

            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _dbContext.Products
                .SingleOrDefaultAsync(p => p.IdProduct == id);

            if (product != null)
            {
                product.Active = false;
                product.ModificationDate = DateTime.Now;

                _dbContext.Products.Update(product);

                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<PagedResponse<Product>> GetPagedAsync(int page, int pageSize, string? search, int? idCategory, 
                    decimal? priceMin, decimal? priceMax, bool? active, string? sortBy, string? sortDir)
        {
            var query = _dbContext.Products
                .Include(p => p.IdCategoryNavigation)
                .AsQueryable();        

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(p => p.Name.Contains(search)); 
            }

            if (idCategory.HasValue)
            {
                query = query.Where(p => p.IdCategory == idCategory);
            }

            if (priceMin.HasValue)
            {
                query = query.Where(p => p.Price >= priceMin);
            }                

            if (priceMax.HasValue)
            {
                query = query.Where(p => p.Price <= priceMax);
            }

            query = query.Where(p => p.Active == (active ?? true));

            int totalRecords = await query.CountAsync();

            query = ApplyOrdering(query, sortBy, sortDir);

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResponse<Product>
            {
                Items = items,
                Total = totalRecords,
                Page = page,
                PageSize = pageSize
            };
        }

        private IQueryable<Product> ApplyOrdering(IQueryable<Product> query, string? sortBy, string? sortDir)
        {
            bool isDesc = sortDir?.ToLower() == "desc";

            return sortBy?.ToLower() switch
            {
                "precio" => isDesc ? query.OrderByDescending(p => p.Price) : query.OrderBy(p => p.Price),
                "fechacreacion" => isDesc ? query.OrderByDescending(p => p.CreationDate) : query.OrderBy(p => p.CreationDate),
                _ => isDesc ? query.OrderByDescending(p => p.Name) : query.OrderBy(p => p.Name),
            };
        }

        public async Task AddRangeAsync(List<Product> products)
        {
            try
            {
                var validProducts = products.Where(p =>
                    !string.IsNullOrEmpty(p.Name) &&
                    p.Price > 0 &&
                    p.IdCategory > 0).ToList();

                await _dbContext.Products.AddRangeAsync(validProducts);

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task RestoreAsync(int id)
        {
            var product = await _dbContext.Products.FindAsync(id);

            if (product != null)
            {
                product.Active = true;
                product.ModificationDate = DateTime.Now;

                await _dbContext.SaveChangesAsync();
            }
        }
    }
}
