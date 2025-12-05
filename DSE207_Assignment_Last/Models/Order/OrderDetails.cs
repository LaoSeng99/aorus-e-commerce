using DSE207_Assignment_Last.Models.Product;

namespace DSE207_Assignment_Last.Models.Order
{
    public class OrderDetails
    {
        public int Id { get; set; }
        public string? OrderDetailsId { get; set; }
        public int Qty { get; set; }

        public Products? Product { get; set; }
        public int ProductId { get; set; }
        public Orders? Order { get; set; }
        public int OrderId { get; set; }
    }
}
