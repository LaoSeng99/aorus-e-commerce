using DSE207_Assignment_Last.Migrations;
using DSE207_Assignment_Last.Models;
using DSE207_Assignment_Last.Models.Cart;
using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models.Order;
using DSE207_Assignment_Last.Models.Product;
using DSE207_Assignment_Last.Models.Seller;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace DSE207_Assignment_Last.Controllers._customer
{
    public class CustomerProfilesFunctionController : Controller
    {
        AppDbContext db = new AppDbContext();
        public IActionResult CheckLogin()
        {
            var x = HttpContext.Session.GetString("customer");

            return x != null ? Json(true) : Json(false);
        }
        public IActionResult LogOut()
        {
            HttpContext.Session.Clear();

            return RedirectToAction("Home", "Store");
        }
        public IActionResult GetuserInfo()
        {
            var login = HttpContext.Session.GetString("customer");
            var selectedUser = db.Customers.FirstOrDefault(e => e.CustomerId == login);
            return Json(selectedUser);
        }
        [HttpPost]
        public ActionResult UpdateImage(string Image)
        {
            var login = HttpContext.Session.GetString("customer");
            var selectedUser = db.Customers.FirstOrDefault(e => e.CustomerId == login);
            selectedUser!.ImageUrl = Image;
            db.SaveChanges();
            return Json("success");
        }
        [HttpPost]
        public ActionResult UpdateBasic(Customers newinfo)
        {
            var login = HttpContext.Session.GetString("customer");
            var selectedUser = db.Customers.FirstOrDefault(e => e.CustomerId == login);

            selectedUser!.ImageUrl = newinfo.ImageUrl;
            selectedUser!.FirstName = newinfo.FirstName;
            selectedUser!.LastName = newinfo.LastName;
            selectedUser!.Gender = newinfo.Gender;
            selectedUser!.ImageUrl = newinfo.ImageUrl;
            db.SaveChanges();
            return Json("success");

        }
        [HttpPost]
        public ActionResult UpdateAddress(Customers newinfo)
        {
            var login = HttpContext.Session.GetString("customer");
            var selectedUser = db.Customers.FirstOrDefault(e => e.CustomerId == login);

            selectedUser!.AddressLine1 = newinfo.AddressLine1;
            selectedUser!.AddressLine2 = newinfo.AddressLine2;
            selectedUser!.City = newinfo.City;
            selectedUser!.State = newinfo.State;
            selectedUser!.ZipCode = newinfo.ZipCode;
            selectedUser!.Country = newinfo.Country;
            db.SaveChanges();
            return Json("success");

        }
        [HttpPost]
        public ActionResult CheckOldPass(string password)
        {
            var login = HttpContext.Session.GetString("customer");
            var selectedUser = db.Customers.FirstOrDefault(e => e.CustomerId == login);

            if (password == selectedUser!.Password)
                return Json("success");

            return Json("faild");

        }
        [HttpPost]
        public ActionResult ChangePassword(string newPass)
        {
            var login = HttpContext.Session.GetString("customer");
            var selectedUser = db.Customers.FirstOrDefault(e => e.CustomerId == login);

            selectedUser!.Password = newPass;
            db.SaveChanges();
            return Json("success");

        }
        public class ProductViewModel
        {
            public Products? product { get; set; }
            public ProductImage image { get; set; }
        }
        public class RecentlyOrderViewModel
        {

            public Orders orders { get; set; }
            public List<ProductViewModel> opList { get; set; }

        }
        public ActionResult GetRecentlyOrder()
        {
            var login = HttpContext.Session.GetString("customer");

            var selectedUser = db.Customers.FirstOrDefault(e => e.CustomerId == login);

            var Order = db.Order.Include(s=>s.Sellers).Include(c=>c.Cart).Where(e => e.Customers!.CustomerId == selectedUser!.CustomerId).ToList();

            List<RecentlyOrderViewModel> RoViewModel = new List<RecentlyOrderViewModel>();



            foreach (var order in Order)
            {
             

                if (RoViewModel
                    .FirstOrDefault(e => e.orders.Sellers!.SellerId == order.Sellers!.SellerId
                    &&order.OrderId==e.orders.OrderId) == null)
                {
                    List<ProductViewModel> newAddProduct = new List<ProductViewModel>();

                    var CartDetails = db.CartDetails.Include(e=>e.Product!.seller).Where(e => e.Cart!.CartId == order.Cart!.CartId).ToList();
                    foreach (var cd in CartDetails)
                    {
                        if (cd.Product!.seller!.SellerId == order.Sellers!.SellerId)
                        {
                            var img = db.ProductImage.FirstOrDefault(e => e.Product!.ProductId == cd.Product.ProductId);
                            newAddProduct.Add(new ProductViewModel()
                            {
                                product = cd.Product!,
                                image = img!
                            });
                        }

                    }



                    RoViewModel.Add(new RecentlyOrderViewModel()
                    {
                        orders = order,
                        opList = newAddProduct
                    });

                }
            }
     


            return Json(RoViewModel);
        }
    }
}
