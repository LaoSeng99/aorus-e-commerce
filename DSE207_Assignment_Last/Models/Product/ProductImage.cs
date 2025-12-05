namespace DSE207_Assignment_Last.Models.Product
{
    public class ProductImage
    {
        public int Id { get; set; }
        public string? ImageId { get; set; }
        public string? ImageUrl { get; set; }
        public Products? Product { get; set; }
        public int ProductId { get; set; }
    }
}
