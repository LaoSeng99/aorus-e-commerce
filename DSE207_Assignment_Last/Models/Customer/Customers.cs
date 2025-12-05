namespace DSE207_Assignment_Last.Models.Customer
{
    public class Customers
    {
        public int Id { get; set; }
        public string? CustomerId { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Nickname { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Gender { get; set; }
        public string? AddressLine1 { get; set; }
        public string? AddressLine2 { get; set; }
        public string? ImageUrl { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? ZipCode { get; set; }
        public string? Country { get; set; }
        public bool isActive { get; set; }
        public DateTime Register_At { get; set; }
    }
}
