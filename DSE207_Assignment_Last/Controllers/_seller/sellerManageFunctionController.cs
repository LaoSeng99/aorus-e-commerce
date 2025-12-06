using DSE207_Assignment_Last.Models.Product;
using DSE207_Assignment_Last.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using Microsoft.CodeAnalysis;
using Stripe;
using System.Security.Cryptography.X509Certificates;
using DSE207_Assignment_Last.Models.Cart;

namespace DSE207_Assignment_Last.Controllers._seller
{
    public class sellerManageFunctionController : Controller
    {
        private class detailViewmodel
        {
            public List<ProductImage>? images { get; set; }
            public Products? product { get; set; }
        }
        private class ProductViewModel
        {
            public Products? product { get; set; }
            public ProductImage? images { get; set; }
        }
        private class CartDetailViewModel
        {
            public Products? product { get; set; }
            public ProductImage? images { get; set; }
            public CartDetails? cartDetails { get; set; }
        }
        private AppDbContext db;
        public sellerManageFunctionController(AppDbContext db)
        {
            this.db = db;
        }
        public ActionResult CheckLogin()
        {
            var x = HttpContext.Session.GetString("seller");
            var selectedSeller = db.Sellers.FirstOrDefault(e => e.SellerId == x);
            return selectedSeller == null ? Json(false) : Json(selectedSeller);
        }
        [Route("sellerFunction/CountingProduct")]
        public IActionResult CountProduct()
        {
            var x = HttpContext.Session.GetString("seller");
            var Count = db.Products.Where(e => e.seller!.SellerId == x && e.isRemoved == false).Count();
            return Json(Count);
        }
        [Route("sellerFunction/ListingProduct")]
        public IActionResult ListProduct()
        {
            var x = HttpContext.Session.GetString("seller");

            var products = db.Products.Where(e => e.seller!.SellerId == x && e.isRemoved == false)
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
        [Route("sellerFunction/ListingOrders")]
        public IActionResult ListOrders()
        {
            var x = HttpContext.Session.GetString("seller");

            var orders = db.Order.Where(e => e.Sellers!.SellerId == x)
                .Include(c => c.Customers).ToList();


            return Json(orders);
        }
        public IActionResult ListOrdersTake5()
        {
            var x = HttpContext.Session.GetString("seller");


            var orders = db.Order.Where(e => e.Sellers!.SellerId == x)
                .Include(c => c.Customers).OrderByDescending(e => e.CreatedDate).Take(5).ToList();


            return Json(orders);
        }
        public IActionResult ListPotential()
        {
            var x = HttpContext.Session.GetString("seller");

            var CartDetails = db.CartDetails.Include(e => e.Product!.seller).Include(e => e.Cart!.Customers).Where(e => e.Product!.seller!.SellerId == x && e.Cart.Status == "Pending"&& e.Cart.Customers.isActive==true)
                .ToList();

            List<CartDetailViewModel> ListDetail = new List<CartDetailViewModel>();
            List<ProductImage> imageList = db.ProductImage.Include(e => e.Product).Where(e => e.Product!.seller!.SellerId == x).ToList();

            foreach (var cd in CartDetails)
            {
                if (ListDetail.FirstOrDefault(e => e.product!.ProductId == cd.Product!.ProductId) == null)
                {
                    ListDetail.Add(new CartDetailViewModel
                    {
                        cartDetails = cd,
                        product = cd.Product,
                        images = imageList.FirstOrDefault(e => e.Product!.ProductId == cd.Product!.ProductId)
                    }); ;
                }
            }

            return Json(ListDetail);
        }

        [Route("sellerFunction/sortingProduct")]
        [HttpPost]
        public IActionResult ListProduct(int CurrentPage, string sort, string order)
        {

            var x = HttpContext.Session.GetString("seller");

            var products = db.Products.Where(e => e.seller!.SellerId == x && e.isRemoved == false)
                .Include(c => c.Categories).ToList();

            int start = CurrentPage == 1 ? 0 : (CurrentPage - 1) * 9;
            int end = 0;
            if (products.Count() < 9)
            {
                end = products.Count();
            }
            else
            {
                end = CurrentPage == 1 ? 9 : products.Count() - start;
            }

            switch (sort)
            {
                case "productname":
                    if (order == "asc")
                        products = products.OrderBy(e => e.Name).ToList();
                    else if (order == "desc")
                        products = products.OrderByDescending(e => e.Name).ToList();

                    break;
                case "category":
                    if (order == "asc")
                        products = products.OrderBy(e => e.Categories!.CategoryName).ToList();
                    else if (order == "desc")
                        products = products.OrderByDescending(e => e.Categories!.CategoryName).ToList();
                    break;
                case "status":
                    if (order == "asc")
                        products = products.OrderBy(e => e.isAvailable).ToList();
                    else if (order == "desc")
                        products = products.OrderByDescending(e => e.isAvailable).ToList();
                    break;
                case "sales":
                    if (order == "asc")
                        products = products.OrderBy(e => e.Sales).ToList();
                    else if (order == "desc")
                        products = products.OrderByDescending(e => e.Sales).ToList();
                    break;
                case "stock":
                    if (order == "asc")
                        products = products.OrderBy(e => e.Stock).ToList();
                    else if (order == "desc")
                        products = products.OrderByDescending(e => e.Stock).ToList();
                    break;
                case "price":
                    if (order == "asc")
                        products = products.OrderBy(e => e.Price).ToList();
                    else if (order == "desc")
                        products = products.OrderByDescending(e => e.Price).ToList();
                    break;
                case "lastmodifed":
                    if (order == "asc")
                        products = products.OrderBy(e => e.Modified_at).ToList();
                    else if (order == "desc")
                        products = products.OrderByDescending(e => e.Modified_at).ToList();
                    break;
            }
            if (sort == "")
            {
                products = products.OrderBy(e => e.Id).ToList();

            }
            products = products.GetRange(start, end);
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

        [Route("sellerFunction/GetCategoryList")]
        public IActionResult ListCategory()
        {
            return Json(db.Categories);
        }
        [Route("sellerFunction/CreateProduct")]
        [HttpPost]
        public ActionResult CreateNewProduct(Products newProduct)
        {
            var x = HttpContext.Session.GetString("seller");
            var seller = db.Sellers.FirstOrDefault(e => e.SellerId == x);
            string productID = Guid.NewGuid().ToString();
            newProduct.Created_at = DateTime.Now;
            newProduct.Modified_at = DateTime.Now;
            newProduct.ProductId = productID;
            newProduct.sellerId = seller.Id;
            newProduct.Sales = 0;
            newProduct.isAvailable = true;
            newProduct.isRemoved = false;
            db.Products.Add(newProduct);
            db.SaveChanges();
            return Json(productID);
        }
        [Route("sellerFunction/uploadImage")]

        [HttpPost]
        public ActionResult uploadImage(string[] imageArray, string productId)
        {
            int selectedProduct = db.Products.FirstOrDefault(e => e.ProductId == productId)!.Id;
            foreach (string image in imageArray)
            {
                db.ProductImage.Add(new ProductImage() { ImageId = Guid.NewGuid().ToString(), ImageUrl = image, ProductId = selectedProduct });
            }
            db.SaveChanges();

            return Json("success");
        }

        [HttpPost]
        public ActionResult changeStatus(string productId)
        {
            var selectedProduct = db.Products.FirstOrDefault(e => e.ProductId == productId);
            selectedProduct!.isAvailable = selectedProduct.isAvailable == true ? false : true;
            selectedProduct.Modified_at = DateTime.Now;
            db.SaveChanges();
            return Json(selectedProduct.isAvailable);
        }
        [HttpPost]
        public ActionResult getProductDetails(string productId)
        {
            var x = HttpContext.Session.GetString("seller");
            var selectedSeller = db.Sellers.FirstOrDefault(e => e.SellerId == x);
            var productList = db.Products
                .Include(e => e.Categories)
                .FirstOrDefault(e => e.seller!.SellerId == selectedSeller!.SellerId
                && e.ProductId == productId);

            List<ProductImage> imageList = db.ProductImage.Where(e => e.Product!.ProductId == productList!.ProductId).ToList();


            detailViewmodel Details = new detailViewmodel()
            {
                product = productList,
                images = imageList
            };
            return Json(Details);
        }
        [HttpPost]
        public ActionResult SaveEditInfo(Products newProduct, string[] image)
        {
            var selectedProduct = db.Products.FirstOrDefault(e => e.ProductId == newProduct.ProductId);


            selectedProduct!.Modified_at = DateTime.Now;
            selectedProduct!.Name = newProduct.Name;
            selectedProduct!.Title = newProduct.Title;
            selectedProduct!.CategoriesId = newProduct.CategoriesId;
            selectedProduct!.Price = newProduct.Price;
            selectedProduct!.Stock = newProduct.Stock;
            selectedProduct!.Discount = newProduct.Discount;
            selectedProduct!.Tag = newProduct.Tag;
            selectedProduct!.Description = newProduct.Description;

            List<ProductImage> imageList = db.ProductImage.Where(e => e.Product!.ProductId == selectedProduct!.ProductId).ToList();

            db.ProductImage.RemoveRange(imageList);
            foreach (string imalink in image)
            {
                db.ProductImage.Add(new ProductImage()
                {
                    ImageId = Guid.NewGuid().ToString(),
                    ImageUrl = imalink,
                    ProductId = selectedProduct.Id
                });
            }



            db.SaveChanges();
            return Json(selectedProduct!.ProductId);
        }
        [HttpPost]
        public ActionResult RemoveProduct(string productId)
        {
            var selectedProduct = db.Products.FirstOrDefault(e => e.ProductId == productId);
            selectedProduct!.isAvailable = false;
            selectedProduct.isRemoved = true;
            selectedProduct.Modified_at = DateTime.Now;
            db.SaveChanges();
            return Json(selectedProduct.isAvailable);
        }


        [HttpPost]
        public ActionResult MultiActiveProduct(string[] ProductIdArray)
        {
            foreach (var product in ProductIdArray)
            {
                var foundProduct = db.Products.FirstOrDefault(e => e.ProductId == product);
                foundProduct!.isAvailable = true;
                foundProduct!.Modified_at = DateTime.Now;
            }
            db.SaveChanges();
            return Json("");
        }

        [HttpPost]
        public ActionResult MultiDisabledProduct(string[] ProductIdArray)
        {
            foreach (var product in ProductIdArray)
            {
                var foundProduct = db.Products.FirstOrDefault(e => e.ProductId == product);
                foundProduct!.isAvailable = false;
                foundProduct!.Modified_at = DateTime.Now;
            }
            db.SaveChanges();
            return Json("");
        }

        [HttpPost]
        public ActionResult MultiDeleteProduct(string[] ProductIdArray)
        {
            foreach (var product in ProductIdArray)
            {
                var foundProduct = db.Products.FirstOrDefault(e => e.ProductId == product);
                foundProduct!.isAvailable = false;
                foundProduct.isRemoved = true;
                foundProduct.Modified_at = DateTime.Now;
            }
            db.SaveChanges();
            return Json("");
        }

        public ActionResult Logout()
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Home", "Store");
        }
        [HttpPost]
        public ActionResult ChangeOrderStatusToSuccess(string OrderId)
        {
            var order = db.Orders.FirstOrDefault(e => e.OrderId == OrderId);
            order!.Status = "Shipping";
            order.ModifiedDate = DateTime.Now;
            order.CompleteDate = DateTime.Now;
            db.SaveChanges();
            return Json(true);
        }
        [HttpPost]
        public ActionResult ChangeOrderStatusToCancel(string OrderId)
        {
            var order = db.Orders.FirstOrDefault(e => e.OrderId == OrderId);
            order!.Status = "Cancelled";
            order.ModifiedDate = DateTime.Now;
            order.CompleteDate = DateTime.Now;
            db.SaveChanges();
            return Json(true);
        }
        public ActionResult GetMonthlyIncome()
        {
            double?[] IncomeMonth = { 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
            var x = HttpContext.Session.GetString("seller");
            var orderList = db.Order.Where(e => e.Status == "Shipping" && e.Sellers!.SellerId == x);

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
        public ActionResult GetCategoryTotalSales()
        {
            var x = HttpContext.Session.GetString("seller");
            var SellerProduct = db.Products.Where(e => e.seller!.SellerId == x).Include(e => e.Categories).ToList();
            var order = db.Order.Where(e => e.Sellers!.SellerId == x).ToList();
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
        public ActionResult GetTop5ProductSales()
        {
            var x = HttpContext.Session.GetString("seller");
            var SellerProduct = db.Products
                .Where(e => e.seller!.SellerId == x).OrderByDescending(e => e.Sales).Take(5).ToList();




            return Json(SellerProduct);
        }
    }

}
