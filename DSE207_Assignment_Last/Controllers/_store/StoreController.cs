using Microsoft.AspNetCore.Mvc;

namespace DSE207_Assignment_Last.Controllers._store
{
    public class StoreController : Controller
    {
        public IActionResult Home()
        {
            return View();
        }


        [Route("/ProductList/{category?}/{sortBy?}")]
        public IActionResult ProductsList()
        {
            return View();
        }

        [Route("/SearchPage/{search?}/{sortBy?}")]
        public IActionResult SearchPage()
        {
            return View();
        }
        [Route("/ProductDetails/{productId?}")]
        public IActionResult ProductDetails()
        {
            return View();
        }
    }
}
