using DSE207_Assignment_Last.Models.Cart;
using DSE207_Assignment_Last.Models.Product;
using DSE207_Assignment_Last.Models.Seller;
using DSE207_Assignment_Last.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DSE207_Assignment_Last.Controllers._cart
{
    public class CustomerCartFunctionController : Controller
    {
        public AppDbContext db = new AppDbContext();
        public IActionResult getCartItemCount()
        {
            var x = HttpContext.Session.GetString("customer");

            var FoundCart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
                            && e.Customers!.CustomerId == x);
            if (FoundCart != null)
            {
                int CartCount = db.CartDetails.Where(e => e.Cart!.CartId == FoundCart!.CartId
                &&  e.Product!.Stock>0 && e.Product.isAvailable == true).Count();
                return Json(CartCount);
            }
            else
            {
                return Json(0);
            }

        }
        public IActionResult getProductStock(string cartDetailsId)
        {
            var selectCartDetails = db.CartDetails.Include(e => e.Product).FirstOrDefault(e => e.CartDetailsId == cartDetailsId);
            return Json(selectCartDetails!.Product!.Stock);
        }
        public class CartDetailsViewModels
        {
            public CartDetails? cartDetails { get; set; }
            public ProductImage? image { get; set; }
        }
        public IActionResult getCartItem()
        {
            var x = HttpContext.Session.GetString("customer");

            var FoundCart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
                            && e.Customers!.CustomerId == x);


            if (FoundCart != null)
            {
                var Image = db.ProductImage.ToList();
                var FoundProduct = db.CartDetails.Include(x => x.Product)
                    .Where(e => e.Cart!.CartId == FoundCart!.CartId
                     &&  e.Product!.Stock>0
                     && e.Product.isAvailable == true).ToList();


                List<CartDetailsViewModels> cartList = new List<CartDetailsViewModels>();

                foreach (var item in FoundProduct)
                {
                    cartList.Add(new CartDetailsViewModels
                    {
                        cartDetails = item,
                        image = Image.FirstOrDefault(x => x.ProductId == item.ProductId)
                    });
                }
                cartList = cartList.OrderByDescending(e => e.cartDetails!.Modified_At).ToList();
                return Json(cartList);
            }
            else
            {
                return Json(0);
            }

        }
        public ActionResult getAddress()
        {
            var x = HttpContext.Session.GetString("customer");
            var SelectedCus = db.Customers.FirstOrDefault(e => e.CustomerId == x);
            return Json(SelectedCus);
        }
        public class CartSellerViewModel
        {
            public Sellers? Sellers { get; set; }

            public List<CartDetailsViewModels>? ListDetails { get; set; }

        }
        public IActionResult getCartDetailsItem()
        {
            var x = HttpContext.Session.GetString("customer");

            var FoundCart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
                            && e.Customers!.CustomerId == x);


            if (FoundCart != null)
            {
                var Image = db.ProductImage.ToList();
                var FoundProduct = db.CartDetails.Include(x => x.Product).Include(s => s.Product!.seller)
                    .Where(e => e.Cart!.CartId == FoundCart!.CartId).ToList();


                List<CartDetailsViewModels> cartList = new List<CartDetailsViewModels>();
                foreach (var item in FoundProduct)
                {

                    cartList.Add(new CartDetailsViewModels
                    {
                        cartDetails = item,
                        image = Image.FirstOrDefault(x => x.ProductId == item.ProductId)
                    });
                }
                cartList = cartList.OrderByDescending(e => e.cartDetails!.Modified_At).ToList();

                List<CartSellerViewModel> sellerList = new List<CartSellerViewModel>();

                foreach (var item in cartList)
                {
                    if (sellerList.FirstOrDefault(e => e.Sellers!.SellerId == item.cartDetails!.Product!.seller!.SellerId) == null)
                    {
                        sellerList.Add(new CartSellerViewModel
                        {
                            Sellers = item.cartDetails!.Product!.seller,
                            ListDetails = cartList.Where(e => e.cartDetails!.Product!.sellerId == item.cartDetails.Product.sellerId).ToList(),
                        });
                    }
                    else
                    {
                        continue;
                    }
                }

                return Json(sellerList);
            }
            else
            {
                return Json(0);
            }


        }
        public ActionResult sideCartAdd(string cartDetailsId)
        {
            var selectCartDetails = db.CartDetails.Include(e => e.Product).FirstOrDefault(e => e.CartDetailsId == cartDetailsId);
            selectCartDetails!.Qty++;
            db.SaveChanges();
            return Json(selectCartDetails);
        }
        public ActionResult sideCartMinus(string cartDetailsId)
        {
            var selectCartDetails = db.CartDetails.Include(e => e.Product).FirstOrDefault(e => e.CartDetailsId == cartDetailsId);
            selectCartDetails!.Qty--;
            db.SaveChanges();

            return Json(selectCartDetails);
        }
        public ActionResult sideCartDelete(string cartDetailsId)
        {
            var selectCartDetails = db.CartDetails.FirstOrDefault(e => e.CartDetailsId == cartDetailsId);
            db.CartDetails.Remove(selectCartDetails!);
            db.SaveChanges();
            return Json(selectCartDetails);
        }

        public ActionResult getSubTotal()
        {
            db = new AppDbContext();
            var x = HttpContext.Session.GetString("customer");
            var FoundCart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
                        && e.Customers!.CustomerId == x);
            if (FoundCart == null)
            {
                return Json("No Item");
            }
            var FoundProduct = db.CartDetails.Where(e => e.Cart!.CartId == FoundCart!.CartId
            && e.Qty <= e.Product!.Stock).Include(x => x.Product).ToList();

            var subTotal = FoundProduct.Sum(e => e.Qty * (e.Product!.Price * ((100 - e.Product.Discount) / 100)));
            return Json(subTotal);
        }
        public ActionResult CartListQtyChange(string cartDetailsId, int InputQty)
        {
            var selectCartDetails = db.CartDetails.Include(e => e.Product).FirstOrDefault(e => e.CartDetailsId == cartDetailsId);

            selectCartDetails!.Qty = InputQty;
            db.SaveChanges();
            return Json(selectCartDetails);
        }
        public ActionResult CheckOutOfStock()
        {
            var x = HttpContext.Session.GetString("customer");

            var FoundCart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
                            && e.Customers!.CustomerId == x);
            var CartCount = db.CartDetails.Include(e => e.Product).Where(e => e.Cart!.CartId == FoundCart!.CartId
            && e.Product!.Stock == 0).ToList();


            List<string> productId = new List<string>();
            foreach (var c in CartCount)
            {
                productId.Add(c.CartDetailsId!);
                db.Remove(c);
            }
            db.SaveChanges();
            return Json(productId);
        }
        public ActionResult CheckStoct()
        {
            var x = HttpContext.Session.GetString("customer");

            var FoundCart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
                            && e.Customers!.CustomerId == x);
            var CartCount = db.CartDetails.Include(e => e.Product).Where(e => e.Cart!.CartId == FoundCart!.CartId
            && e.Qty > e.Product!.Stock && e.Product.Stock != 0).ToList();


            List<CartDetails> productId = new List<CartDetails>();
            foreach (var c in CartCount)
            {
                productId.Add(c);
                c.Qty = (int)c.Product!.Stock!;
            }
            db.SaveChanges();
            return Json(productId);
        }

        public ActionResult CheckIsInvalid()
        {
            var x = HttpContext.Session.GetString("customer");

            var FoundCart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
                            && e.Customers!.CustomerId == x);
            var CartCount = db.CartDetails.Include(e => e.Product).Where(e => e.Cart!.CartId == FoundCart!.CartId
            && e.Product!.isAvailable == false).ToList();


            List<string> productId = new List<string>();
            foreach (var c in CartCount)
            {
                productId.Add(c.CartDetailsId!);
                db.Remove(c);
            }
            db.SaveChanges();
            return Json(productId);
        }

    }
}
