using ClosedXML.Excel;
using System.Collections.Generic;
using System.Linq;

namespace CatalogApi.Utils
{
    public static class ExcelHelper
    {
        public static Dictionary<string, int> GetHeaderMap(IXLRangeRow headerRow)
        {
            var map = new Dictionary<string, int>();

            var columns = new Dictionary<string, string[]>
            {
                { "Nombre", new[] { "nombre", "name", "producto", "product" } },
                { "Precio", new[] { "precio", "price", "valor", "cost" } },
                { "Stock",  new[] { "stock", "cantidad", "quantity", "inventory" } },
                { "Categoria", new[] { "categoria", "category", "idcategoria", "categoryid" } }
            };

            foreach (var cell in headerRow.CellsUsed())
            {
                string headerText = cell.Value.ToString().ToLower().Trim();

                foreach (var column in columns)
                {
                    if (column.Value.Contains(headerText))
                    {
                        map[column.Key] = cell.Address.ColumnNumber;
                    }
                }
            }

            return map;
        }
    }
}