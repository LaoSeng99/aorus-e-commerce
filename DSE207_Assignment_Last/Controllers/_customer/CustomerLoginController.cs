using Microsoft.AspNetCore.Mvc;

namespace DSE207_Assignment_Last.Controllers._customer
{
    public class CustomerLoginController : Controller
    {
        public IActionResult Login()
        {
            return View();
        }
        public IActionResult ForgotPassword()
        {
            return View();
        }

    }
}
