using DSE207_Assignment_Last.Models.Product;

namespace DSE207_Assignment_Last.Models.Cart
{
    public class CartDetails
    {
        public int Id { get; set; }
        public string? CartDetailsId { get; set; }
        public DateTime? Create_At { get; set; }
        public DateTime? Modified_At { get; set; }
        public Carts? Cart { get; set; }
        public int CartId { get; set; }

        public Products? Product { get; set; }
        public int ProductId { get; set; }

        public int Qty { get; set; }
    }
}
