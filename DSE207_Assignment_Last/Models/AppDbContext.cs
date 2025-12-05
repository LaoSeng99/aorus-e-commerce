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

        {    //                                                   ((更改成database的server name))

            //optionBuilder.UseSqlServer(@"Server= ((copyfromyourSQLServer-Servername)) ;Database=namethedatabasename; Trusted_Connection=True;");

            optionBuilder.UseSqlServer(@"Server=LAOSENG\SQLEXPRESS;Database=DSE_207_Assignment_Final; Trusted_Connection=True;");

            // 三个nuget packgage 6.0.11 version  entityframework.core/tools/sqlserver
            //然后tools > manage nuget package
            //-- Add-migration intial
            //-- update-database
        }
    }
}
