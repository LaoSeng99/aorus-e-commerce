using DSE207_Assignment_Last.Models;
using DSE207_Assignment_Last.Models.Order;
using DSE207_Assignment_Last.Models.Product;
using DSE207_Assignment_Last.Models.Seller;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.VisualBasic.Syntax;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace DSE207_Assignment_Last.Controllers._admin
{
    public class AdminFunctionController : Controller
    {
        private AppDbContext db;
        public AdminFunctionController(AppDbContext db)
        {
            this.db = db;
        }
        private class ProductViewModel
        {
            public Products? product { get; set; }
            public ProductImage? images { get; set; }
        }

        public IActionResult CheckLogin()
        {
            var x = HttpContext.Session.GetString("admin");
            if (x == null)
            {
                return Json(false);
            }
            return Json(true);
        }
        public IActionResult Login(string name, string pass)
        {
            var admin = db.Admins.FirstOrDefault(e => e.Name == name && e.Password == pass);
            if (admin != null)
            {
                HttpContext.Session.SetString("admin", admin!.AdminId!);
                return Json(admin);
            }
            return Json(false);
        }
        public ActionResult GetCustomerList()
        {
            return Json(db.Customers);
        }
        public ActionResult GetSellerList()
        {
            return Json(db.Sellers.Where(e => e.Approval_At != null));
        }
        public ActionResult GetUnApprovalList()
        {
            return Json(db.Sellers.Where(e => e.Approval_At == null));
        }
        [HttpPost]
        public IActionResult ListProduct(string SellerId)
        {

            var products = db.Products.Where(e => e.seller!.SellerId == SellerId && e.isRemoved == false)
                .Include(c => c.Categories).ToList();

            products = products.OrderByDescending(c => c.Modified_at).ToList();

            var image = db.ProductImage;

            List<ProductViewModel> productList = new List<ProductViewModel>();
            foreach (var product in products)
            {
                productList.Add(new ProductViewModel()
                {
                    product = product,
                    images = image.FirstOrDefault(e => e.ProductId == product.Id)!
                });
            }
            return Json(productList);
        }
        [HttpPost]
        public IActionResult ApprovalSeller(string SellerId)
        {
            var selectedSeller = db.Sellers.FirstOrDefault(e => e.SellerId == SellerId);
            selectedSeller!.Approval_At = DateTime.Now;
            selectedSeller.isActive = true;
            db.SaveChanges();
            return Json(selectedSeller);
        }
        [HttpPost]
        public IActionResult GetSellerInfo(string SellerId)
        {
            var selectedSeller = db.Sellers.FirstOrDefault(e => e.SellerId == SellerId);

            return Json(selectedSeller);
        }
        [HttpPost]
        public IActionResult ChangeSellerStatus(string SellerId)
        {
            var selectedSeller = db.Sellers.FirstOrDefault(e => e.SellerId == SellerId);

            selectedSeller!.isActive = selectedSeller.isActive == true ? false : true;
            var SellerProduct = db.Products.Where(e => e.seller.SellerId == selectedSeller.SellerId);

            foreach (var item in SellerProduct)
            {
                item.isAvailable = false;
            }

            db.SaveChanges();


            return Json(selectedSeller.isActive);
        }
        [HttpPost]
        public IActionResult ChangeCustomerStatus(string CustomerId)
        {
            var selectedCustomer = db.Customers.FirstOrDefault(e => e.CustomerId == CustomerId);

            selectedCustomer!.isActive = selectedCustomer.isActive == true ? false : true;
            db.SaveChanges();
            return Json(selectedCustomer.isActive);
        }

        [HttpPost]
        public ActionResult MultiActiveCustomer(string[] CustomerIdArray)
        {
            foreach (var customer in CustomerIdArray)
            {
                var foundProduct = db.Customers.FirstOrDefault(e => e.CustomerId == customer);
                foundProduct!.isActive = true;

            }
            db.SaveChanges();
            return Json("");
        }

        [HttpPost]
        public ActionResult MultiDisabledCustomer(string[] CustomerIdArray)
        {
            foreach (var customer in CustomerIdArray)
            {
                var foundProduct = db.Customers.FirstOrDefault(e => e.CustomerId == customer);
                foundProduct!.isActive = false;
            }
            db.SaveChanges();
            return Json("");
        }


        [HttpPost]
        public ActionResult MultiActiveSeller(string[] SellerIdArray)
        {
            foreach (var seller in SellerIdArray)
            {
                var foundSeller = db.Sellers.FirstOrDefault(e => e.SellerId == seller);
                foundSeller!.isActive = true;

            }
            db.SaveChanges();
            return Json("");
        }

        [HttpPost]
        public ActionResult MultiDisabledSeller(string[] SellerIdArray)
        {
            foreach (var seller in SellerIdArray)
            {
                var foundSeller = db.Sellers.FirstOrDefault(e => e.SellerId == seller);
                foundSeller!.isActive = false;
                var foundProduct = db.Products.Where(e => e.seller!.SellerId == foundSeller.SellerId);
                foreach (var product in foundProduct)
                {
                    product.isAvailable = false;
                }
            }
            db.SaveChanges();
            return Json("");
        }



        public ActionResult GetMonthlyIncome(string sellerId)
        {
            double?[] IncomeMonth = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            var orderList = db.Order.Where(e => e.Status == "Shipping" && e.Sellers!.SellerId == sellerId);

            for (int i = 1; i <= 12; i++)
            {
                IncomeMonth[i - 1] = (double)orderList.Where(e => e.CreatedDate!.Value.Month == i).Sum(p => p.GrandTotal)!;
            }



            return Json(IncomeMonth);
        }
        public class CategoriesSalesView
        {
            public Categories categories { get; set; }
            public int sales { get; set; }
        }
        public ActionResult GetCategoryTotalSales(string sellerId)
        {

            var SellerProduct = db.Products.Where(e => e.seller!.SellerId == sellerId).Include(e => e.Categories).ToList();
            var order = db.Order.Where(e => e.Sellers!.SellerId == sellerId).ToList();
            List<CategoriesSalesView> categories = new List<CategoriesSalesView>();

            foreach (var pd in SellerProduct)
            {
                if (categories.FirstOrDefault(e => e.categories.Id == pd.CategoriesId) == null)
                {
                    categories.Add(new CategoriesSalesView
                    {
                        categories = pd.Categories!,
                        sales = (int)SellerProduct.Where(e => e.CategoriesId == pd.CategoriesId).Sum(e => e.Sales)!
                    });
                }
            }

            return Json(categories);
        }
        public ActionResult GetTop5ProductSales(string sellerId)
        {

            var SellerProduct = db.Products
                .Where(e => e.seller!.SellerId == sellerId).OrderByDescending(e => e.Sales).Take(5).ToList();

            return Json(SellerProduct);
        }
        private class ListThree
        {
            public int[] orders { get; set; }
            public Sellers seller { get; set; }
        }
        public ActionResult GetTopThreeSeller()
        {

            var TotalOrder = (from o in db.Orders
                              where o.Status == "Shipping" || o.Status == "Success"
                              join s in db.Sellers on o.SellersId equals s.Id
                              group o by o.SellersId into os

                              select new { sellerId = os.Key, CountOrder = os.Count() }
                              ).OrderByDescending(e => e.CountOrder).Take(3).ToList();

            var TotalList = db.Orders.Where(e => e.Status == "Shipping" || e.Status == "Success").ToList();
            int Count = 0;
            List<ListThree> listTopThree = new List<ListThree>();
            var sellerList = db.Sellers.ToList();
            foreach (var sellerO in TotalOrder)
            {

                int[] ordersCount = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                for (int i = 1; i < 12; i++)
                {
                    ordersCount[i - 1] = TotalList.Where(e => e.SellersId == TotalOrder[Count].sellerId && e.CreatedDate!.Value.Month == i).Count();
                }
                listTopThree.Add(new ListThree
                {
                    orders = ordersCount,
                    seller = sellerList.FirstOrDefault(e => e.Id == sellerO.sellerId)!
                });
                Count++;
            }
            return Json(listTopThree);
        }
        public ActionResult GetAllCategorySales()
        {

            var Product = db.Products.Include(e => e.Categories).ToList();

            List<CategoriesSalesView> categories = new List<CategoriesSalesView>();

            foreach (var pd in Product)
            {
                if (categories.FirstOrDefault(e => e.categories.Id == pd.CategoriesId) == null)
                {
                    categories.Add(new CategoriesSalesView
                    {
                        categories = pd.Categories!,
                        sales = (int)Product.Where(e => e.CategoriesId == pd.CategoriesId).Sum(e => e.Sales)!
                    });
                }
            }

            return Json(categories);
        }
        public ActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Admin");
        }
    }
}
