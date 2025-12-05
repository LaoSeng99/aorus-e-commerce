using Microsoft.AspNetCore.Mvc;

namespace DSE207_Assignment_Last.Controllers._cart
{
    public class CustomerCartController : Controller
    {
        public IActionResult CartList()
        {
            return View();
        }
    }
}
