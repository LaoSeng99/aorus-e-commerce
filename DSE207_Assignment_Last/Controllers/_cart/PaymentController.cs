using DSE207_Assignment_Last.Migrations;
using DSE207_Assignment_Last.Models;
using DSE207_Assignment_Last.Models.Cart;
using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models.Order;
using DSE207_Assignment_Last.Models.Seller;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.VisualBasic.Syntax;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using MimeKit;
using Stripe;
using System.Collections.Generic;
using static DSE207_Assignment_Last.Controllers._cart.CustomerCartFunctionController;

namespace DSE207_Assignment_Last.Controllers._cart
{

    public class PaymentController : Controller
    {
        AppDbContext db = new AppDbContext();
        private readonly DtoStripeSecrets _stripeSecrets;

        static DtoStripeSecrets stripeSecrets = new DtoStripeSecrets()
        {
            SecretKey = "***REMOVED***",
            PublishableKey = "***REMOVED***"
        };

        [Route("/PaymentCheckOutPage/{ordersid?}/{cartId?}")]
        public IActionResult PaymentCheckOutPage()
        {
            return View();
        }

        public IActionResult CreateOrder(int ShippingFee)
        {
            var x = HttpContext.Session.GetString("customer");

            var Customer = db.Customers.FirstOrDefault(e => e.CustomerId == x && e.isActive == true);


            var Cart = db.Cart.FirstOrDefault(e => e.Status == "Pending"
            && e.Customers!.CustomerId == Customer!.CustomerId);

            var CartDetails = db.CartDetails.Include(e => e.Product)
                .Include(c => c.Product!.seller).Where(e => e.Cart!.CartId == Cart!.CartId).ToList();

            List<CartDetailsViewModels> cartList = new List<CartDetailsViewModels>();
            foreach (var item in CartDetails)
            {
                item.Product!.Stock -= item.Qty;
                cartList.Add(new CartDetailsViewModels
                {
                    cartDetails = item,
                });
            }
            List<CartSellerViewModel> sellerList = new List<CartSellerViewModel>();

            foreach (var details in cartList)
            {
                if (sellerList.FirstOrDefault(e => e.Sellers!.SellerId == details.cartDetails!.Product!.seller!.SellerId) == null)
                {
                    sellerList.Add(new CartSellerViewModel
                    {
                        Sellers = details.cartDetails!.Product!.seller,
                        ListDetails = cartList.Where(e => e.cartDetails!.Product!.sellerId == details.cartDetails.Product.sellerId).ToList(),
                    });
                }
            }
            List<Orders> OrderList = new List<Orders>();
            string orderIdList = "";
            foreach (var Order in sellerList)
            {
                var SubTotal = Order.ListDetails!
                    .Sum(e => (e.cartDetails!.Product!.Price
                    * ((100 - e.cartDetails.Product.Discount) / 100)) * e.cartDetails.Qty);
                var GrandTotal = SubTotal + ShippingFee;

                string OrderId = Guid.NewGuid().ToString();
                orderIdList += $"{OrderId}&";
                db.Orders.Add(new Orders()
                {
                    OrderId = OrderId,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    CompleteDate = null,
                    CartId = Cart!.Id,
                    Status = "Pending",
                    ShippingFee = ShippingFee,
                    SubTotal = SubTotal,
                    GrandTotal = GrandTotal,
                    SellersId = Order!.Sellers!.Id,
                    CustomersId = Customer!.Id
                });

            }




            Cart!.Status = "Checkout";
            db.SaveChanges();
            orderIdList += $"|{Cart!.CartId}";
            return Json(orderIdList);
        }
        [HttpPost]
        public IActionResult GetAllOrder(string[] OrderArray)
        {
            var x = HttpContext.Session.GetString("customer");
            var Customer = db.Customers.FirstOrDefault(e => e.CustomerId == x && e.isActive == true);
            List<Orders> ALLOrder = new List<Orders>();
            foreach (var order in OrderArray)
            {
                var foundOrder = db.Orders
                    .Include(p => p.Cart!.Customers)
                    .Include(c => c.Sellers).FirstOrDefault(e => e.OrderId == order
                     && e.Status == "Pending");
                if (foundOrder != null)
                    ALLOrder.Add(foundOrder!);
            }

            return Json(ALLOrder);
        }
        [HttpPost]
        public JsonResult PaymentCheckOutPage(_CreditCard creditCard, string[] OrderId, string CartId)
        {
            var customerId = HttpContext.Session.GetString("customer");
            List<Orders> orderList = new List<Orders>();
            var SelectedCustomer = db.Customers.FirstOrDefault(e => e.CustomerId == customerId);

            foreach (var id in OrderId)
            {
                orderList.Add(db.Order.Include(e => e.Cart).FirstOrDefault(e => e.OrderId == id)!);
            }

            var Cart = db.Cart.FirstOrDefault(e => e.CartId! == CartId);

            var CartDetails = db.CartDetails.Include(e => e.Product)
                .Include(c => c.Product!.seller).Where(e => e.Cart!.CartId == Cart!.CartId).ToList();


            foreach (var item in CartDetails)
            {
                item.Product!.Sales += item.Qty;

            }

            try
            {


                StripePayment stripePayment = new StripePayment(new _CreditCard
                {
                    //Get From Checkout page

                    Number = creditCard.number,//4242 4242 4242 4242
                    ExpMonth = creditCard.expMonth,
                    ExpYear = creditCard.expYear + 2000,
                    Cvc = creditCard.Cvc, //123
                    Amount = (long)orderList.Sum(e => e.GrandTotal)! * 100 /*data.Amount*/, //2000 = 20.00   10000 == ??

                    //===================================================

                    //Get From Login User
                    Name = SelectedCustomer!.Nickname!,  //CardOwner
                    Email = SelectedCustomer!.Email!,  // Which Email Receive notify
                    AddressLine1 = SelectedCustomer.AddressLine1!,  //Billing Address
                    AddressLine2 = SelectedCustomer.AddressLine2!,
                    AddressCity = SelectedCustomer.City!,
                    AddressState = SelectedCustomer.State!,
                    AddressZip = SelectedCustomer.ZipCode!,

                    //===================================================

                    //Fixed
                    Descripcion = $"Purchase on {DateTime.Now:d}",  //Referrence

                    // CartList ID
                    DetailsDescripcion = $"MiaoDaTa{DateTime.Now:d}", //Details Referrence
                    Currency = "MYR"


                }, stripeSecrets);
                Charge charge = stripePayment.ProccessPayment();


                foreach (var od in orderList)
                {
                    List<CartDetails> orderDetails = new List<CartDetails>();
                    foreach (var cd in CartDetails)
                    {
                        if (cd.Product!.seller!.SellerId == od.Sellers!.SellerId)
                        {
                            orderDetails.Add(cd);
                        }
                    }
                    od.Status = "PaymentSuccess";

                    od.ModifiedDate = DateTime.Now;

                    SendInvoiceToEmail(od.Sellers!, od.Customers!, od, orderDetails);
                }
                //foreach (var ctId in SelectedTransactionHistory!.CartList!.Split(","))
                //{
                //    var SelectPRODUCT = db.Carts.Include(p => p.Product).FirstOrDefault(e => e.CartId == ctId);
                //    SelectPRODUCT!.Product!.Stock -= SelectPRODUCT.Quantity;
                //    SelectPRODUCT.Product.Sales += SelectPRODUCT.Quantity;
                //    SelectPRODUCT.Status = "Success";

                //}

                db.SaveChanges();

                //Update transaction
                return Json(true);
            }
            catch (Exception ex)
            {

                //Update transaction

                return Json(ex.Message);
            }
        }
        public IActionResult PaymentSuccess()
        {
            return View();
        }
        public IActionResult PaymentFailure(string Ms)
        {
            ViewBag.ErrorMsg = Ms;
            return View();
        }
        public void SendInvoiceToEmail(Sellers seller, Customers customers, Orders order, List<CartDetails> cartList)
        {

            Random random = new Random();

            string InvoicePart1 = $"\r\n" +

                $"<div style='width:100%;'> <h1 style='text-align:center'> Invoice</h1> </div>" +
              $"<div style='display:flex;justify-content:space-between'>" +

              $"<h3>To: </h4>" +
                $"<table style=\"width:50%;display:inline-block;border:1px solid #e1e1e1;border:radius:3px;padding:10px;\">\r\n  " +
            $"  <thead style=\"display:inline-block;\">\r\n    " +
            $"    <tr>\r\n        " +
            $"    <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\">Name</th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\">Phone Number</th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\">Address</th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\"></th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\"></th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\">Invoice Created On</th>\r\n    " +
            $"    </tr>\r\n    </thead>\r\n   " +
            $" <tbody style=\"display:inline-block\">\r\n      " +
            $"  <tr>\r\n            <td style=\"display:block;text-align:left;\">{customers.Nickname}</td>\r\n     " +
            $"       <td style=\"display:block;text-align:left;\">{customers.PhoneNumber}</td>\r\n      " +
            $"      <td rowspan='3' style=\"display:block;text-align:left;\">{customers.AddressLine1} <br/>{customers.AddressLine2}<br/>{customers.City} {customers.ZipCode}, {customers.State}<br/>{customers.Country}</td>\r\n          " +
            $"  <td style=\"display:block;text-align:left;\">{String.Format("{0:MM/dd/yyyy}", DateTime.Now)}  " +
            $"   </tr>\r\n    </tbody>\r\n" +
            $"</table>\r\n" +



                            $"<h3>From: </h4>" +
                $"<table style=\"width:50%;display:inline-block;border:1px solid #e1e1e1;border:radius:3px;padding:10px;\">\r\n  " +
            $"  <thead style=\"display:inline-block;\">\r\n    " +
            $"    <tr>\r\n        " +
            $"    <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\">Name</th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\">Phone Number</th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\">Address</th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\"></th>\r\n       " +
            $"     <th style=\"display:block;text-align:left;font-family:Arial, Helvetica, sans-serif;\"></th>\r\n       " +

            $"    </tr>\r\n    </thead>\r\n   " +
            $" <tbody style=\"display:inline-block\">\r\n      " +
            $"  <tr>\r\n            <td style=\"display:block;text-align:left;\">{seller.Name}</td>\r\n     " +
            $"       <td style=\"display:block;text-align:left;\">{seller.PhoneNumber}</td>\r\n      " +
            $"      <td rowspan='3' style=\"display:block;text-align:left;\">{seller.AddressLine1} <br/>{seller.AddressLine2}<br/>{seller.City} {customers.ZipCode}, {seller.State}<br/>{seller.Country}</td>\r\n          " +

            $"   </tr>\r\n    </tbody>\r\n" +
            $"</table>\r\n" +
             $"  </div> " +


            $"<table style=\"margin: 1em 0;width:100%;border-collapse:collapse;border-spacing: 0;border: 1px solid #ddd;\">\r\n  " +
$"  <thead>\r\n    " +
$"    <tr>\r\n           " +
$" <th style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:left;padding:10px;\">Products</th>\r\n      " +
$"      <th style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:left;padding:10px;\">Quantity</th>\r\n       " +
$"     <th style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:left;padding:10px;\">Unit Price</th>\r\n        " +
$"    <th style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:left;padding:10px;\">Discount</th>\r\n   " +
$"    <th style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:left;padding:10px;\">Total Price</th>\r\n   " +
$"     </tr>\r\n    </thead>\r\n    <tbody style=\"background:#ffffff;\">\r\n      " +
$"  <tr>\r\n      ";

            string InvoiceProduct = "";
            foreach (var cd in cartList)
            {
                InvoiceProduct +=

$"      <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;\">{cd.Product!.Name}</td>\r\n       " +
$"     <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;\">{cd.Qty}</td>\r\n    " +
$"        <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;\">{cd.Product.Price}</td>\r\n    " +
$"        <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;\">{cd.Product.Discount}%</td>\r\n" +
$"        <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;\">{string.Format("{0:C}", (cd.Product.Price * (100 - cd.Product.Discount) / 100) * cd.Qty)}</td>\r\n" +
$"        </tr>\r\n     "
;
            }
            string InvoicePart2 = $"  <tr>\r\n           " +
$" <td colspan=\"4\" style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:right;padding:10px;\">\r\n Sub Total\r\n  " +
$"      </td>\r\n        " +
$"    <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;color:#3498DB;\">{string.Format("{0:C}", order.SubTotal)}</td>\r\n    " +
$"    </tr>\r\n   " +
$"  <tr>\r\n           " +
$" <td colspan=\"4\" style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:right;padding:10px;\">\r\n Shipping Fee\r\n  " +
$"      </td>\r\n        " +
$"    <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;color:#3498DB;\">{string.Format("{0:C}", order.ShippingFee)}</td>\r\n    " +
$"    </tr>\r\n   " +
$"  <tr>\r\n           " +
$" <td colspan=\"4\" style=\"font-weight: bold;font-family:Arial, Helvetica, sans-serif\r\n;text-align:right;padding:10px;\">\r\n Grand Total\r\n  " +
$"      </td>\r\n        " +
$"    <td style=\"font-family:Arial, sans-serif;font-size:15px;padding:7px;color:#3498DB;\">{string.Format("{0:C}", order.GrandTotal)}</td>\r\n    " +
$"    </tr>\r\n   " +
$" </tbody>\r\n" +
$"</table>\r\n\r\n";
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("***REMOVED***")); //sender Email
            email.To.Add(MailboxAddress.Parse(customers!.Email));
            email.Subject = "MiaoDaTaInvoice";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html)
            {
                Text = $"<div style='border:1px solid black'>" + InvoicePart1 + InvoiceProduct + InvoicePart2 + "</div>"

            };

            using var smtp = new SmtpClient();

            smtp.Connect("***REMOVED***", ***REMOVED***);

            smtp.Authenticate("***REMOVED***", "***REMOVED***");

            smtp.Send(email);
            smtp.Disconnect(true);

        }

    }
}
