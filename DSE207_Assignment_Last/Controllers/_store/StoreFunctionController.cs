using DSE207_Assignment_Last.Models.Cart;
using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models.Product;
using DSE207_Assignment_Last.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DSE207_Assignment_Last.Controllers._store
{
    public class StoreFunctionController : Controller
    {
        private class ProductViewModel
        {
            public Products? product { get; set; }
            public ProductImage? images { get; set; }
        }
        private AppDbContext db;
        public StoreFunctionController(AppDbContext db)
        {
            this.db = db;
        }
        public ActionResult ProductCounting(string Category)
        {
            switch (Category.ToLower())
            {
                case "all": return Json(db.Products.Where(e => e.isAvailable == true).Count());
                default: return Json(db.Products.Where(e => e.Categories!.CategoryName!.ToLower() == Category.ToLower() && e.isAvailable == true).Count());
            }
        }
        public ActionResult GetProductList(string Category, int currentPage, string sortBy)
        {
            var selectedCate = db.Products.Include(e => e.Categories).Where(x => x.isAvailable == true).ToList();
            int start = currentPage == 1 ? 0 : (currentPage - 1) * 9;
            int end = 0;
            if (sortBy != null)
            {
                switch (sortBy.ToLower())
                {
                    case "featured": break;
                    case "newest":
                        selectedCate = selectedCate.OrderByDescending(e => e.Created_at).ToList(); break;
                    case "oldest":
                        selectedCate = selectedCate.OrderBy(e => e.Created_at).ToList(); break;
                    case "priceh":
                        selectedCate = selectedCate.OrderByDescending(e => e.Price).ToList(); break;
                    case "pricel":
                        selectedCate = selectedCate.OrderBy(e => e.Price).ToList(); break;
                    case "nameatoz":
                        selectedCate = selectedCate.OrderBy(e => e.Name).ToList(); break;
                    case "nameztoa":
                        selectedCate = selectedCate.OrderByDescending(e => e.Name).ToList(); break;
                    case "hotsell":
                        selectedCate = selectedCate.OrderByDescending(e => e.Sales).ToList(); break;
                }
            }


            switch (Category.ToLower())
            {
                case "all":

                    end = selectedCate.Count() - start < 9 ? selectedCate.Count() - start : 9;

                    selectedCate = selectedCate.GetRange(start, end);

                    break;
                default:
                    selectedCate = selectedCate
    .Where(e => e.Categories!.CategoryName!.ToLower() == Category.ToLower()).ToList();


                    end = selectedCate.Count() - start < 9 ? selectedCate.Count() - start : 9;


                    selectedCate = selectedCate.GetRange(start, end).ToList();

                    break;
            }


            var image = db.ProductImage;

            List<ProductViewModel> productList = new List<ProductViewModel>();
            foreach (var product in selectedCate)
            {
                productList.Add(new ProductViewModel()
                {
                    product = product,
                    images = image.FirstOrDefault(e => e.ProductId == product.Id)!
                });
            }
            return Json(productList);
        }


        public ActionResult SearchProductCount(string searchInput)
        {
    
            return Json(db.Products.Where(x => x.isAvailable == true && x.Name!.ToLower()!.Contains(searchInput)
                 ||
                 x.isAvailable == true && x.Tag!.ToLower()!.Contains(searchInput)).Count());

        }
        public ActionResult GetRecenltySearchList()
        {
            var x = HttpContext.Session.GetString("customer");
            if (x != null)
            {
                var RecentlySearchList = db.RecentlySearch.Where(e => e.Customers!.CustomerId == x).OrderByDescending(d => d.HistoryCreated_At).ToList();


                int take = RecentlySearchList.Count() > 5 ? 5 : RecentlySearchList.Count();

                RecentlySearchList = RecentlySearchList.Take(take).ToList();

                return Json(RecentlySearchList);
            }
            else
            {
                return Json(false);
            }

        }

        public ActionResult GetSearchProduct(string searchInput, int currentPage, string sortBy)
        {

            var x = HttpContext.Session.GetString("customer");
            if (x != null)
            {
                var selectedCustomer = db.Customers.FirstOrDefault(e => e.CustomerId == x);
                var lastCheck = db.RecentlySearch.ToList();
                if (lastCheck[lastCheck.Count() - 1].RecentlySearchName!.ToLower() != searchInput.ToLower())
                {
                    db.RecentlySearch.Add(new RecentlySearch
                    {
                        RecentlySearchName = searchInput,
                        HistoryCreated_At = DateTime.Now,
                        CustomersId = selectedCustomer!.Id
                    });
                }
         
                db.SaveChanges();

            }


            searchInput = searchInput.ToLower();
            var AllProduct = db.Products.Include(e => e.Categories)
                .Where(x => x.isAvailable == true && x.Name!.ToLower()!.Contains(searchInput.ToLower())
                ||
                x.isAvailable == true && x.Tag!.ToLower()!.Contains(searchInput.ToLower())
                ||
                x.isAvailable == true && x.Categories!.CategoryName!.ToLower()!.Contains(searchInput.ToLower())).ToList();

            int start = currentPage == 1 ? 0 : (currentPage - 1) * 8;
            int end = 0;
            if (AllProduct.Count() < 8)
            {
                end = AllProduct.Count();
            }
            else
            {
                end = currentPage == 1 ? 8 : AllProduct.Count() - start;
            }




            if (sortBy != null)
            {
                switch (sortBy.ToLower())
                {
                    case "featured": break;
                    case "newest":
                        AllProduct = AllProduct.OrderByDescending(e => e.Created_at).ToList(); break;
                    case "oldest":
                        AllProduct = AllProduct.OrderBy(e => e.Created_at).ToList(); break;
                    case "priceh":
                        AllProduct = AllProduct.OrderByDescending(e => e.Price).ToList(); break;
                    case "pricel":
                        AllProduct = AllProduct.OrderBy(e => e.Price).ToList(); break;
                    case "nameatoz":
                        AllProduct = AllProduct.OrderBy(e => e.Name).ToList(); break;
                    case "nameztoa":
                        AllProduct = AllProduct.OrderByDescending(e => e.Name).ToList(); break;
                    case "hotsell":
                        AllProduct = AllProduct.OrderByDescending(e => e.Sales).ToList(); break;
                }
            }

            AllProduct = AllProduct.GetRange(start, end).ToList();

            var image = db.ProductImage;

            List<ProductViewModel> productList = new List<ProductViewModel>();
            foreach (var product in AllProduct)
            {
                productList.Add(new ProductViewModel()
                {
                    product = product,
                    images = image.FirstOrDefault(e => e.ProductId == product.Id)!
                });
            }
            return Json(productList);

        }

        public ActionResult ProductListAddToCart(string ProductId)
        {
            var x = HttpContext.Session.GetString("customer");
            var selectProduct = db.Products.FirstOrDefault(e => e.isAvailable == true && e.ProductId == ProductId);
            var CustomerCart = db.Cart.FirstOrDefault(e => e.Customers!.CustomerId == x && e.Status == "Pending");

            if (CustomerCart == null)
            {
                CustomerCart = new Carts();
                var Customer = db.Customers.FirstOrDefault(e => e.CustomerId == x);

                CustomerCart!.Status = "Pending";
                CustomerCart.CustomersId = Customer!.Id;
                CustomerCart.CartId = Guid.NewGuid().ToString();
                db.Cart.Add(CustomerCart);
                db.SaveChanges();
                CustomerCart.Id = db.Cart.FirstOrDefault(e => e.CartId == CustomerCart.CartId)!.Id;
            }

            var ProductInCart = db.CartDetails
                .FirstOrDefault(e => e.Cart!.CartId == CustomerCart!.CartId
                && e.Product!.ProductId == ProductId
                );

            if (ProductInCart == null)
            {
                db.CartDetails.Add(new CartDetails
                {
                    CartDetailsId = Guid.NewGuid().ToString(),
                    CartId = CustomerCart.Id,
                    Qty = 1,
                    ProductId = selectProduct!.Id,
                    Create_At = DateTime.Now,
                    Modified_At = DateTime.Now
                });

                db.SaveChanges();
                return Json("success");
            }
            else
            {
                if (ProductInCart.Qty + 1 > selectProduct!.Stock)
                {
                    return Json("reachTheLimit");
                }
                ProductInCart.Modified_At = DateTime.Now;
                ProductInCart.Qty++;

                db.SaveChanges();
                return Json("success");
            }

        }


        private class BestProductViewMode
        {
            public Products? product { get; set; }
            public ProductImage? images { get; set; }
        }
        public ActionResult GetBestProduct()
        {
            var BestProduct = db.Products.OrderBy(e => e.Sales).Take(15).ToList();

            var image = db.ProductImage;
            Random rand = new Random();
            List<Products> randomList = new List<Products>();
            for (int i = 0; i < 12; i++)
            {
                int num = rand.Next(BestProduct.Count());
                randomList.Add(BestProduct[num]);
                BestProduct.Remove(BestProduct[num]);
            }

            List<ProductViewModel> productList = new List<ProductViewModel>();
            foreach (var product in randomList)
            {
                productList.Add(new ProductViewModel()
                {
                    product = product,
                    images = image.FirstOrDefault(e => e.ProductId == product.Id)!
                });
            }
            return Json(productList);

        }

        private class ProductDetailsViewMode
        {
            public Products? product { get; set; }
            public List<ProductImage>? images { get; set; }

        }
        [HttpPost]
        public ActionResult GetProductDetails(string ProductId)
        {
            var selectedProduct = db.Products.FirstOrDefault(e => e.isAvailable == true && e.ProductId == ProductId);

            if (selectedProduct == null)
            {
                return Json("ProductNotFound");
            }

            List<ProductImage> imageList = db.ProductImage.Where(e => e.Product!.ProductId == ProductId).ToList();




            ProductDetailsViewMode Details = new ProductDetailsViewMode()
            {
                product = selectedProduct,
                images = imageList
            };
            return Json(Details);
        }

        [HttpPost]
        public ActionResult DetailsPageAddCart(string productId, int inputQty)
        {
            var x = HttpContext.Session.GetString("customer");

            var selectedCustomer = db.Customers
                .FirstOrDefault(e => e.isActive == true && e.CustomerId == x);
            var selectedProduct = db.Products
                .FirstOrDefault(e => e.isAvailable == true && e.ProductId == productId);
            var selectedCustomerCart = db.Cart
                .FirstOrDefault(e => e.Customers!.CustomerId == selectedCustomer!.CustomerId && e.Status == "Pending");

            if (selectedCustomerCart == null)
            {
                selectedCustomerCart!.CartId = Guid.NewGuid().ToString();
                db.Cart.Add(new Carts
                {
                    CartId = selectedCustomerCart!.CartId,
                    Status = "Pending",
                    CustomersId = selectedCustomer!.Id
                });
                db.SaveChanges();
                selectedCustomerCart = db.Cart
                    .FirstOrDefault(e => e.CartId == selectedCustomerCart.CartId);

                db.CartDetails.Add(new CartDetails
                {
                    CartDetailsId = Guid.NewGuid().ToString(),
                    Create_At = DateTime.Now,
                    Modified_At = DateTime.Now,
                    Qty = inputQty,
                    CartId = selectedCustomerCart!.Id,
                    ProductId = selectedProduct!.Id
                });
                db.SaveChanges();
                return Json(true);
            }

            var selectCartDetails = db.CartDetails
                .FirstOrDefault(e => e.Cart!.CartId == selectedCustomerCart.CartId
                && e.Product!.ProductId == productId
                );

            if (selectCartDetails == null)
            {//Create New One

                db.CartDetails.Add(new CartDetails
                {
                    CartDetailsId = Guid.NewGuid().ToString(),
                    Create_At = DateTime.Now,
                    Modified_At = DateTime.Now,
                    Qty = inputQty,
                    CartId = selectedCustomerCart!.Id,
                    ProductId = selectedProduct!.Id
                });
                db.SaveChanges();
                return Json(true);
            }
            var totalQty = selectCartDetails.Qty + inputQty;
            if (totalQty <= selectedProduct!.Stock)
            {
                selectCartDetails.Qty = totalQty;
                selectCartDetails.Modified_At = DateTime.Now;
                db.SaveChanges();
                return Json(true);
            }
            else
            {
                return Json(false);
            }
        }

        public ActionResult GetFourRandomFourPick()
        {
            var BestProduct = db.Products.OrderBy(e => e.Sales).Take(15).ToList();

            var image = db.ProductImage;
            Random rand = new Random();
            List<Products> randomList = new List<Products>();
            for (int i = 0; i < 4; i++)
            {
                int num = rand.Next(BestProduct.Count());
                randomList.Add(BestProduct[num]);
                BestProduct.Remove(BestProduct[num]);
            }

            List<ProductViewModel> productList = new List<ProductViewModel>();
            foreach (var product in randomList)
            {
                productList.Add(new ProductViewModel()
                {
                    product = product,
                    images = image.FirstOrDefault(e => e.ProductId == product.Id)!
                });
            }
            return Json(productList);
        }

    }
}
