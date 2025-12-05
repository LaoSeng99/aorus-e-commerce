using Microsoft.AspNetCore.Mvc;

namespace DSE207_Assignment_Last.Controllers._admin
{
    public class AdminController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Dashboard()
        {
            return View();
        }
        [Route("/Manage_User/Seller")]
        public IActionResult Manage_User_Seller()
        {
            return View();
        }
        [Route("/Manage_User/Customer")]
        public IActionResult Manage_User_Customer()
        {
            return View();
        }
    }
}
