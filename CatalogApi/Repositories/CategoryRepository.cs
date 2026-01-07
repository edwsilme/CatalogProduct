using CatalogApi.Data;
using CatalogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace CatalogApi.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly CatalogDbContext _dbContext;

        public CategoryRepository(CatalogDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Category?> GetByIdAsync(int id)
        {
            var query = _dbContext.Categories
                 .AsNoTracking()
                 .Where(c => c.IdCategory == id && c.Active == true);

            Category? category = await query.FirstOrDefaultAsync();

            return category;
        }

        public async Task<Category> AddAsync(Category category)
        {
            _dbContext.Categories.Add(category);

            await _dbContext.SaveChangesAsync();

            return category;
        }

        public async Task UpdateAsync(Category category)
        {
            _dbContext.Entry(category).State = EntityState.Modified;

            _dbContext.Entry(category).Property(x => x.CreationDate).IsModified = false;

            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var category = await _dbContext.Categories.FindAsync(id);

            if (category != null)
            {
                category.Active = false;

                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(string name)
        {
            string searchName = name.Trim().ToLower();

            bool exists = await _dbContext.Categories
                .AsNoTracking()
                .AnyAsync(c => c.Name.ToLower() == searchName && c.Active == true);

            return exists;
        }

        public async Task<IEnumerable<Category>> GetAllAsync()
        {
            var categories = await _dbContext.Categories
                .AsNoTracking()
                .Where(c => c.Active == true)
                .ToListAsync();

            return categories;
        }
    }
}