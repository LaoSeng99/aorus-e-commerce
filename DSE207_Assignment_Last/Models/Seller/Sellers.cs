using Microsoft.VisualBasic;

namespace DSE207_Assignment_Last.Models.Seller
{
    public class Sellers
    {
        public int Id { get; set; }
        public string? SellerId { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? ImageUrl { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public bool? isActive { get; set; }
        public DateTime Registered_At { get; set; }
        public DateTime? Approval_At { get; set; }

    }
}
