using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models;
using Microsoft.AspNetCore.Mvc;
using MimeKit;
using MailKit.Net.Smtp;
using NuGet.Protocol.Plugins;
using System.Security.Cryptography.Xml;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace DSE207_Assignment_Last.Controllers._customer
{
    public class CustomerLoginFunctionController : Controller
    {
        private AppDbContext db;
        public CustomerLoginFunctionController(AppDbContext db)
        {
            this.db = db;
        }
        [HttpPost]
        public IActionResult Login(string login, string loginId, string password)
        {
            var CustomerList = db.Customers.Where(e => e.isActive == true).ToList();
            Customers selectedUser = null!;
            if (loginId == "Phone")
            {
                if (login.StartsWith("60"))
                {
                    login = "+" + login;
                }
                else if (login.StartsWith("0"))
                {
                    login = "+6" + login;
                }
                selectedUser = CustomerList.FirstOrDefault(e => e.PhoneNumber == login && e.Password == password)!;


            }
            if (loginId == "Email")
            {
                selectedUser = CustomerList.FirstOrDefault(e => e.Email == login.ToLower() && e.Password == password)!;

            }
            if (selectedUser == null)
            {
                return Json("Faild");
            }
            else
            {

                HttpContext.Session.SetString("customer", selectedUser.CustomerId!);
                return Json("success");
            }

        }

        [HttpPost]
        public IActionResult CheckEmailExist(string email)
        {
            var check = db.Customers.FirstOrDefault(e => e.Email == email.ToLower());

            return check != null ? Json("Exist") : Json("NotExist");
        }
        [HttpPost]
        public IActionResult CheckPhoneberExist(string phone)
        {

            if (phone.StartsWith("60"))
            {
                phone = "+" + phone;
            }
            else if (phone.StartsWith("0"))
            {
                phone = "+6" + phone;
            }
            var check = db.Customers.FirstOrDefault(e => e.PhoneNumber == phone);

            return check != null ? Json("Exist") : Json("NotExist");
        }
        [HttpPost]
        public IActionResult Register(Customers newCustomer)
        {
            string phone = newCustomer.PhoneNumber!;
            if (phone.StartsWith("60"))
            {
                phone = "+" + phone;
            }
            else if (phone.StartsWith("0"))
            {
                phone = "+6" + phone;
            }
            db.Customers.Add(new Customers()
            {
                CustomerId = Guid.NewGuid().ToString(),
                Nickname = newCustomer.Nickname,
                Email = newCustomer.Email!.ToLower(),
                Password = newCustomer.Password,
                PhoneNumber = phone,
                FirstName = "",
                LastName = "",
                AddressLine1 = "",
                AddressLine2 = "",
                City = "",
                Country = "Malaysia",
                ZipCode = "",
                State = "",
                Gender = "",
                Register_At = DateTime.Now,
                ImageUrl = "/Image/Customer/UserImage.jpg",
                isActive = true,

            });
            db.SaveChanges();
            return Json("success");
        }

        public IActionResult OTPsend(string phoneNumber)
        {

            var accountSid = "***REMOVED***";
            var authToken = "***REMOVED***";
            TwilioClient.Init(accountSid, authToken);

            Random random = new Random();
            const string chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZ123456789";
            var x = new string(Enumerable.Repeat(chars, 6)
             .Select(s => s[random.Next(0, chars.Length)]).ToArray());

            var messageOptions = new CreateMessageOptions(
                new PhoneNumber("+60149342218"));
            messageOptions.MessagingServiceSid = "***REMOVED***";
            messageOptions.Body = $"Your Phone Number :{phoneNumber} submit register request for new account ,Your OTP is " + x;
            var message = MessageResource.Create(messageOptions);




            return Json(x);
        }
        [HttpPost]
        public IActionResult SendEmailOtp(string sendEmail)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZ123456789@#$%&*";
            var x = new string(Enumerable.Repeat(chars, 6)
             .Select(s => s[random.Next(0, chars.Length)]).ToArray());
            return Json(x);

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("***REMOVED***")); //sender Email
            email.To.Add(MailboxAddress.Parse(sendEmail));
            email.Subject = "Test Subject";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = $"Your Email :{sendEmail} submit register request for new account ,Your New Login Password for Miaodata is " + x };

            using var smtp = new SmtpClient();

            smtp.Connect("***REMOVED***", ***REMOVED***);

            smtp.Authenticate("***REMOVED***", "***REMOVED***");

            smtp.Send(email);
            smtp.Disconnect(true);
        }  // True == Enter Right OTP 

        [HttpPost]
        public IActionResult ResetPassCheckExist(string AccountId, string type)
        {
            var CustomerList = db.Customers.Where(e => e.isActive == true).ToList();


            Customers selectedUser = null!;
            if (type == "Phone")
            {
                if (AccountId.StartsWith("60"))
                {
                    AccountId = "+" + AccountId;
                }
                else if (AccountId.StartsWith("0"))
                {
                    AccountId = "+6" + AccountId;
                }

                selectedUser = CustomerList.FirstOrDefault(e => e.PhoneNumber == AccountId && e.isActive == true)!;

            }
            if (type == "Email")
            {
                selectedUser = CustomerList.FirstOrDefault(e => e.Email == AccountId.ToLower() && e.isActive == true)!;

            }
            if (selectedUser == null)
            {
                return Json("NotExist");
            }
            else
            {
                return Json("Exist");
            }
        }
        [HttpPost]
        public IActionResult ResetPassword(string AccountId, string type)
        {
            var CustomerList = db.Customers.Where(e => e.isActive == true).ToList();
            Customers selectedUser = null!;
            if (type == "Phone")
            {
                if (AccountId.StartsWith("60"))
                {
                    AccountId = "+" + AccountId;
                }
                else if (AccountId.StartsWith("0"))
                {
                    AccountId = "+6" + AccountId;
                }

                selectedUser = CustomerList.FirstOrDefault(e => e.PhoneNumber == AccountId && e.isActive == true)!;
                selectedUser.Password = OTPresetPhone(AccountId);
            }
            if (type == "Email")
            {
                selectedUser = CustomerList.FirstOrDefault(e => e.Email == AccountId.ToLower() && e.isActive == true)!;
                selectedUser.Password = OTPresetEmail(AccountId);
            }
            db.SaveChanges();
            return Json("success");

        }
        public string OTPresetPhone(string id)
        {
    
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZ123456789";
            var x = new string(Enumerable.Repeat(chars, 16)
             .Select(s => s[random.Next(0, chars.Length)]).ToArray());
            return x;

            var accountSid = "***REMOVED***";
            var authToken = "***REMOVED***";
            TwilioClient.Init(accountSid, authToken);

            var messageOptions = new CreateMessageOptions(
                new PhoneNumber("+60149342218"));
            messageOptions.MessagingServiceSid = "***REMOVED***";
            messageOptions.Body = "Your New Login Password for Miaodata is " + x;
            var message = MessageResource.Create(messageOptions);
        }
        public string OTPresetEmail(string id)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZ123456789";
            var x = new string(Enumerable.Repeat(chars, 16)
             .Select(s => s[random.Next(0, chars.Length)]).ToArray());
            return x;
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("***REMOVED***")); //sender Email
            email.To.Add(MailboxAddress.Parse(id));
            email.Subject = "Test Subject";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = $"Your New Login Password for Miaodata is </br> </br><strong style='font-size:24px'>{x.ToString()}</strong>" };

            using var smtp = new SmtpClient();

            smtp.Connect("***REMOVED***", ***REMOVED***);

            smtp.Authenticate("***REMOVED***", "***REMOVED***");

            smtp.Send(email);
            smtp.Disconnect(true);

        
        }



        public IActionResult ResetOTPsend(string phoneNumber)
        {

            var accountSid = "***REMOVED***";
            var authToken = "***REMOVED***";
            TwilioClient.Init(accountSid, authToken);

            Random random = new Random();
            const string chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZ123456789";
            var x = new string(Enumerable.Repeat(chars, 6)
             .Select(s => s[random.Next(0, chars.Length)]).ToArray());

            var messageOptions = new CreateMessageOptions(
                new PhoneNumber("+60149342218"));
            messageOptions.MessagingServiceSid = "***REMOVED***";
            messageOptions.Body = $"Your Phone Number :{phoneNumber} submit request for Reset Password ,Your OTP is " + x;
            var message = MessageResource.Create(messageOptions);




            return Json(x);
        }
        [HttpPost]
        public IActionResult SendResetEmailOtp(string sendEmail)
        {
            Random random = new Random();
            const string chars = "ABCDEFGHIJKLNMOPQRSTUVWXYZ123456789@#$%&*";
            var x = new string(Enumerable.Repeat(chars, 6)
             .Select(s => s[random.Next(0, chars.Length)]).ToArray());
            return Json(x);
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("***REMOVED***")); //sender Email
            email.To.Add(MailboxAddress.Parse(sendEmail));
            email.Subject = "Test Subject";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = $"Your Email :{sendEmail} submit request for Reset Password ,Your OTP is <strong>" + x + "</strong>" };

            using var smtp = new SmtpClient();

            smtp.Connect("***REMOVED***", ***REMOVED***);

            smtp.Authenticate("***REMOVED***", "***REMOVED***");

            smtp.Send(email);
            smtp.Disconnect(true);

 


        }  // True == Enter Right OTP 

    }
}
