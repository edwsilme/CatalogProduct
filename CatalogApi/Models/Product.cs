using System;
using System.Collections.Generic;

namespace CatalogApi.Models;

public partial class Product
{
    public int IdProduct { get; set; }

    public int IdCategory { get; set; }

    public string Name { get; set; } = null!;

    public string? Description { get; set; }

    public string? Sku { get; set; }

    public decimal Price { get; set; }

    public int Stock { get; set; }

    public bool Active { get; set; }

    public DateTime? CreationDate { get; set; }

    public DateTime? ModificationDate { get; set; }

    public virtual Category IdCategoryNavigation { get; set; } = null!;
}