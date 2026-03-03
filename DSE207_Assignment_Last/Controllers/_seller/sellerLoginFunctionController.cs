using DSE207_Assignment_Last.Models;
using DSE207_Assignment_Last.Models.Config;
using DSE207_Assignment_Last.Models.Customer;
using DSE207_Assignment_Last.Models.Seller;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using MimeKit;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;

namespace DSE207_Assignment_Last.Controllers._seller
{
    public class sellerLoginFunctionController : Controller
    {
        private AppDbContext db; 
        private EmailSettings emailSettings;
        public sellerLoginFunctionController(AppDbContext db, IOptions<EmailSettings> emailOptions)
        {
            this.db = db;
            emailSettings = emailOptions.Value;

        }
        [HttpPost]
        public IActionResult Login(string login, string loginId, string password)
        {
            var sellerList = db.Sellers.Where(e => e.isActive == true).ToList();
            Sellers selectedUser = null!;
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
                selectedUser = sellerList.FirstOrDefault(e => e.PhoneNumber == login && e.Password == password)!;


            }
            if (loginId == "Email")
            {
                selectedUser = sellerList.FirstOrDefault(e => e.Email == login.ToLower() && e.Password == password)!;

            }
            if (selectedUser == null)
            {
                return Json("Faild");
            }
            else
            {
                HttpContext.Session.SetString("seller", selectedUser.SellerId!);
                return Json(selectedUser.SellerId);
            }

        }

        [HttpPost]
        public IActionResult CheckEmailExist(string email)
        {
            var check = db.Sellers.FirstOrDefault(e => e.Email == email.ToLower());

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
            var check = db.Sellers.FirstOrDefault(e => e.PhoneNumber == phone);

            return check != null ? Json("Exist") : Json("NotExist");
        }
        [HttpPost]
        public IActionResult Register(Sellers newSeller)
        {
            string phone = newSeller.PhoneNumber!;
            if (phone.StartsWith("60"))
            {
                phone = "+" + phone;
            }
            else if (phone.StartsWith("0"))
            {
                phone = "+6" + phone;
            }
            db.Sellers.Add(new Sellers()
            {
                SellerId = Guid.NewGuid().ToString(),
                Email = newSeller.Email!.ToLower(),
                Password = newSeller.Password,
                PhoneNumber = phone,
                Name = newSeller.Name,
                AddressLine1 = newSeller.AddressLine1,
                AddressLine2 = newSeller.AddressLine2,
                City = newSeller.City,
                Country = "Malaysia",
                ZipCode = newSeller.ZipCode,
                State = newSeller.State,
                Registered_At = DateTime.Now,
                ImageUrl = "/Image/Customer/UserImage.jpg",
                isActive = false,

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
        public IActionResult ResetPassCheckExist(string AccountId, string type)
        {
            var SellerList = db.Sellers.Where(e => e.isActive == true).ToList();
            Sellers selectedUser = null!;
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
                selectedUser = SellerList.FirstOrDefault(e => e.PhoneNumber == AccountId && e.isActive == true)!;

            }
            if (type == "Email")
            {
                selectedUser = SellerList.FirstOrDefault(e => e.Email == AccountId.ToLower() && e.isActive == true)!;

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
            var SellerList = db.Sellers.Where(e => e.isActive == true).ToList();
            Sellers selectedUser = null!;
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
                selectedUser = SellerList.FirstOrDefault(e => e.PhoneNumber == AccountId && e.isActive == true)!;
                selectedUser.Password = OTPresetPhone(AccountId);
            }
            if (type == "Email")
            {
                selectedUser = SellerList.FirstOrDefault(e => e.Email == AccountId.ToLower() && e.isActive == true)!;
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
            email.From.Add(MailboxAddress.Parse(emailSettings.SmtpUsername)); //sender Email
            email.To.Add(MailboxAddress.Parse(id));
            email.Subject = "Test Subject";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = $"Your New Login Password for Miaodata is </br> </br><strong style='font-size:24px'>{x.ToString()}</strong>" };

            using var smtp = new SmtpClient();
            smtp.Connect(emailSettings.SmtpServer, emailSettings.SmtpPort);

            smtp.Authenticate(emailSettings.SmtpUsername, emailSettings.SenderPassword);

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
            email.From.Add(MailboxAddress.Parse(emailSettings.SmtpUsername)); //sender Email
            email.To.Add(MailboxAddress.Parse(sendEmail));
            email.Subject = "Test Subject";
            email.Body = new TextPart(MimeKit.Text.TextFormat.Html) { Text = $"Your Email :{sendEmail} submit request for Reset Password ,Your OTP is <strong>" + x + "</strong>" };

            using var smtp = new SmtpClient();

            smtp.Connect(emailSettings.SmtpServer, emailSettings.SmtpPort);

            smtp.Authenticate(emailSettings.SmtpUsername, emailSettings.SenderPassword);

            smtp.Send(email);
            smtp.Disconnect(true);



        }  // True == Enter Right OTP 
    }
}
