using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models.Seller;

namespace DSE207_Assignment_Last.Models.Order
{
    public class Invoice
    {
        public int Id { get; set; }
        public string? InvoiceId { get; set; }
        public Customers? Customers { get; set; }
        public int CustomersId { get; set; }
        public Sellers? Sellers { get; set; }
        public int SellersId { get; set; }

        public Orders? Orders { get; set; }
        public int OrdersId { get; set; }   
    }
}
