using DSE207_Assignment_Last.Models.Order;
using Microsoft.AspNetCore.Mvc;

namespace DSE207_Assignment_Last.Controllers._customer
{
    public class CustomerProfilesController : Controller
    {
        [Route("/Customer_Profiles/Overview")]
        public IActionResult Overview()
        {
            return View();
        }
        [Route("/Customer_Profiles/Edit_profiles")]
        public IActionResult EditProfiles()
        {
            return View();
        }
        [Route("/Customer_Profiles/Change_password")]
        public IActionResult ChangePassword()
        {
            return View();
        }
        [Route("/Customer_Profiles/Change_address")]
        public IActionResult ChangeAddress()
        {
            return View();
        }
        [Route("/Customer_Profiles/Orders")]
        public IActionResult Orders()
        {
            return View();
        }
    }
}
