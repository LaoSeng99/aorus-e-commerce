using Microsoft.AspNetCore.Mvc;

namespace DSE207_Assignment_Last.Controllers._seller
{
    public class sellerManageController : Controller
    {
        [Route("Seller_Manage/Dashboard/{sellerid?}")]
        public IActionResult Dashboard()
        {
            return View();
        }
        [Route("Seller_Manage/Products_List")]
        public IActionResult ManageProduct()
        {
            return View();
        }
        [Route("Seller_Manage/Edit_Product/{productid?}")]
        public IActionResult EditProduct()
        {
            return View();
        }
        [Route("Seller_Manage/Products_List/Create_New_Product")]
        public IActionResult CreateNewProduct()
        {
            return View();
        }
        [Route("Seller_Manage/Order")]
        public IActionResult OrderList()
        {
            
            return View();
        }
        [Route("Seller_Manage/Potential_Customers")]
        public IActionResult PotentialCustomers()
        {
            return View();
        }

    }
}
