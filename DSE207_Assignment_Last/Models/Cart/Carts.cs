using DSE207_Assignment_Last.Models.Customer;

namespace DSE207_Assignment_Last.Models.Cart
{
    public class Carts
    {
        public int Id { get; set; }
        public string? CartId { get; set; }
        public string? Status { get; set; }

        public Customers? Customers { get; set; }
        public int CustomersId { get; set; }
    }
}
