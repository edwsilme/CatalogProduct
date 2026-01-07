using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.Controllers
{
    [Route("api/categorias")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoriesController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetCategory()
        {
            try
            {
                var categories = await _categoryRepository.GetAllAsync();

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener las categorías", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CategoryCreateDto modelDto)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(modelDto.Name))
                {

                    return BadRequest(new { message = "El nombre de la categoría es obligatorio" });
                }
 
                bool exist = await _categoryRepository.ExistsAsync(modelDto.Name);

                if (exist)
                {
                    return BadRequest(new { message = "Ya existe una categoría con ese nombre" });
                }

                var category = new Category
                {
                    Name = modelDto.Name,
                    Description = modelDto.Description,
                    Active = true,
                    CreationDate = DateTime.Now
                };

                var newCategory = await _categoryRepository.AddAsync(category);

                return CreatedAtAction(nameof(GetCategory), new { id = newCategory.IdCategory }, newCategory);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno al crear la categoría", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryUpdateDto modelDto)
        {
            try
            {
                if (id != modelDto.IdCategory)
                {
                    return BadRequest(new { message = "El ID de la URL no coincide con el del cuerpo de la solicitud" });
                }

                var existingCategory = await _categoryRepository.GetByIdAsync(id);

                if (existingCategory == null)
                {
                    return NotFound(new { message = "Categoría no encontrada" });
                }

                existingCategory.Name = modelDto.Name;
                existingCategory.Description = modelDto.Description;
                existingCategory.Active = modelDto.Active;
                existingCategory.ModificationDate = DateTime.Now;

                await _categoryRepository.UpdateAsync(existingCategory);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar la categoría", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var existing = await _categoryRepository.GetByIdAsync(id);

                if (existing == null)
                {
                    return NotFound(new { message = "La categoría que intenta eliminar no existe" });
                }

                await _categoryRepository.DeleteAsync(id);

                return Ok(new { message = "Categoría eliminada correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al procesar la eliminación", details = ex.Message });
            }
        }
    }
}