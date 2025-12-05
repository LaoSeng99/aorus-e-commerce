using Microsoft.AspNetCore.Mvc;

namespace DSE207_Assignment_Last.Controllers._seller
{
    public class sellerLoginController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult ForgotPass()
        {
            return View();
        }
    }
}
