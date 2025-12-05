using DSE207_Assignment_Last.Models.Seller;
using System.ComponentModel.DataAnnotations;

namespace DSE207_Assignment_Last.Models.Product
{
    public class Products
    {
        [Key]
        public int Id { get; set; }
        public string? ProductId { get; set; }
        public string? Name { get; set; }
        public string? Tag { get; set; }
        //Accept Multiple Tag,  split with |
        public string? Title { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public decimal? Discount { get; set; }

        public int? Stock { get; set; }
        public int? Sales { get; set; }
        public bool? isAvailable { get; set; }
        public bool? isRemoved { get; set; }
        public DateTime Created_at { get; set; }
        public DateTime Modified_at { get; set; }
        public Sellers? seller { get; set; }
        public int sellerId { get; set; }

        public Categories? Categories { get; set; }
        public int? CategoriesId { get; set; }


    }
}
