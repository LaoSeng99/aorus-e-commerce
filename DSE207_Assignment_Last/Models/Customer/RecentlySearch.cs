namespace DSE207_Assignment_Last.Models.Customer
{
    public class RecentlySearch
    {
        public int Id { get; set; }
        public string? RecentlySearchName { get; set; }
        public DateTime? HistoryCreated_At { get; set; }
        public Customers? Customers { get; set; }
        public int CustomersId { get; set; }
    }
}
