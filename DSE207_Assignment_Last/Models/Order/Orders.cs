using DSE207_Assignment_Last.Models.Cart;
using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models.Seller;

namespace DSE207_Assignment_Last.Models.Order
{
    public class Orders
    {
        public int Id { get; set; }
        public string? OrderId { get; set; }
        public string? Status { get; set; }
        public decimal? ShippingFee { get; set; }
        public decimal? SubTotal { get; set; }
        public decimal? GrandTotal { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public Sellers? Sellers { get; set; }
        public int SellersId { get; set; }
        public Customers? Customers { get; set; }
        public int CustomersId { get; set; }
        public Carts? Cart { get; set; }
        public int CartId { get; set; }
    }
}
