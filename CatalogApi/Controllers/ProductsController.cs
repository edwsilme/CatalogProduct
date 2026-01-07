using CatalogApi.DTOs;
using CatalogApi.Models;
using CatalogApi.Repositories;
using CatalogApi.Utils;
using ClosedXML.Excel;
using Microsoft.AspNetCore.Mvc;

namespace CatalogApi.Controllers
{
    [Route("api/productos")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepository;

        public ProductsController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts(int page = 1, int pageSize = 10, string? search = null,
            int? idCategoria = null, decimal? precioMin = null, decimal? precioMax = null, bool? activo = null,
            string? sortBy = "nombre", string? sortDir = "asc")
        {
            try
            {
                if (page <= 0) 
                {
                    page = 1;
                }

                if (pageSize <= 0) 
                { 
                    pageSize = 10; 
                }

                var result = await _productRepository.GetPagedAsync(page, pageSize, search, idCategoria, precioMin, precioMax, activo, sortBy, sortDir);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error interno al obtener productos", details = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);

            if (product == null) 
            { 
                return NotFound(new { message = "Producto no encontrado" }); 
            }

            return Ok(product);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromBody] ProductCreateDto modelDto)
        {
            if (string.IsNullOrEmpty(modelDto.Name))
            {
                return BadRequest(new { message = "El nombre es obligatorio" });
            }

            if (modelDto.Price <= 0)
            {
                return BadRequest(new { message = "El precio debe ser mayor a 0" });
            }

            if (modelDto.IdCategory <= 0)
            {
                return BadRequest(new { message = "La categoría es obligatoria" });
            }

            try
            {
                var product = new Product
                {
                    IdCategory = modelDto.IdCategory,
                    Name = modelDto.Name,
                    Description = modelDto.Description,
                    Sku = modelDto.Sku,
                    Price = modelDto.Price,
                    Stock = modelDto.Stock,
                    Active = true,
                    ModificationDate = DateTime.Now
                };

                var newProduct = await _productRepository.AddAsync(product);

                return CreatedAtAction(nameof(GetProductById), new { id = newProduct.IdProduct }, newProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear el producto", details = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ProductUpdateDto modelDto)
        {
            if (id != modelDto.IdProduct)
            {
                return BadRequest(new { message = "El ID no coincide o no existe el producto" });
            }

            if (modelDto.Price <= 0)
            {
                return BadRequest(new { message = "El precio debe ser mayor a 0" });
            }

            try
            {
                var existingProduct = await _productRepository.GetByIdAsync(id);

                if (existingProduct == null) 
                { 
                    return NotFound(); 
                }

                existingProduct.IdCategory = modelDto.IdCategory;
                existingProduct.Name = modelDto.Name;
                existingProduct.Description = modelDto.Description;
                existingProduct.Price = modelDto.Price;
                existingProduct.Stock = modelDto.Stock;
                existingProduct.Active = modelDto.Active;

                await _productRepository.UpdateAsync(existingProduct);

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al actualizar el producto", details = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _productRepository.DeleteAsync(id);

                return Ok(new { message = "Producto eliminado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar el producto", details = ex.Message });
            }
        }

        [HttpPost("productosMasivo")]
        public async Task<IActionResult> UploadMasivo(IFormFile file)
        {
            if (file == null || !file.FileName.EndsWith(".xlsx"))
            {
                return BadRequest(new { message = "Por favor suba un archivo Excel (.xlsx) válido" });
            }                

            try
            {
                using var stream = new MemoryStream();
                await file.CopyToAsync(stream);
                using var workbook = new XLWorkbook(stream);
                var worksheet = workbook.Worksheet(1);
                var rows = worksheet.RangeUsed().RowsUsed();

                var headerMap = ExcelHelper.GetHeaderMap(rows.First());
                var productsToLoad = new List<Product>();

                foreach (var row in rows.Skip(1))
                {
                    var product = new Product
                    {
                        Name = row.Cell(headerMap["Nombre"]).GetValue<string>(),
                        Price = row.Cell(headerMap["Precio"]).GetValue<decimal>(),
                        Stock = row.Cell(headerMap["Stock"]).GetValue<int>(),
                        IdCategory = row.Cell(headerMap["Categoria"]).GetValue<int>(),
                        Active = true
                    };

                    if (!string.IsNullOrEmpty(product.Name) && product.Price > 0)
                    {
                        productsToLoad.Add(product);
                    }
                }

                await _productRepository.AddRangeAsync(productsToLoad);

                return Ok(new { message = $"Se procesaron {productsToLoad.Count} productos exitosamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "No se pudo procesar el archivo", details = ex.Message });
            }
        }

        [HttpPatch("{id}/restore")]
        public async Task<IActionResult> Restore(int id)
        {
            try
            {
                var product = await _productRepository.GetByIdAsync(id);

                if (product == null)
                {
                    return NotFound();
                }

                await _productRepository.RestoreAsync(id);

                return Ok(new { message = "Producto reactivado correctamente" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al reactivar el producto", details = ex.Message });
            }
        }
    }
}