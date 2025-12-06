using DSE207_Assignment_Last.Models.Admin;
using DSE207_Assignment_Last.Models.Cart;
using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models.Order;
using DSE207_Assignment_Last.Models.Product;
using DSE207_Assignment_Last.Models.Seller;
using Microsoft.EntityFrameworkCore;

namespace DSE207_Assignment_Last.Models
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Admins> Admins { get; set; } = null!;
        public DbSet<Customers> Customers { get; set; } = null!;
        public DbSet<RecentlySearch> RecentlySearch { get; set; } = null!;
        public DbSet<Carts> Cart { get; set; } = null!;
        public DbSet<CartDetails> CartDetails { get; set; } = null!;
        public DbSet<Orders> Order { get; set; } = null!;
        public DbSet<OrderDetails> OrderDetails { get; set; } = null!;
        public DbSet<Products> Products { get; set; } = null!;
        public DbSet<ProductImage> ProductImage { get; set; } = null!;
        public DbSet<Categories> Categories { get; set; } = null!;
        public DbSet<Sellers> Sellers { get; set; } = null!;
        public DbSet<Orders> Orders { get; set; } = null!;
        public DbSet<OrderDetails> OrderDetail { get; set; } = null!;
        public DbSet<Invoice> Invoice { get; set; } = null!;
     


        //public DbSet<BigCart> B_Cart { get; set; } = null!;
        //public DbSet<smallCart> S_Cart { get; set; } = null!;
        //public DbSet<Categories> Category { get; set; } = null!;


        protected override void OnConfiguring(DbContextOptionsBuilder optionBuilder)
        {    
        }
    }
}
