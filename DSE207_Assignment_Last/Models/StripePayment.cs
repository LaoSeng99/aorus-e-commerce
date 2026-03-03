using Stripe;

namespace DSE207_Assignment_Last.Models
{
    public class StripePayment
    {


        private TokenService Tokenservice;
        private Token stripeToken;
        private bool isTransectionSuccess;
        private _CreditCard _dtoCreditDebitCard;
        private Charge charge;
        private DtoStripeSecrets _stripeSecrets;

        public StripePayment(_CreditCard dtoCreditDebitCard, DtoStripeSecrets stripeSecrets)
        {
            this._dtoCreditDebitCard = dtoCreditDebitCard;
            _stripeSecrets = stripeSecrets;
        }
        private string CreateToken()
        {
            try
            {
                StripeConfiguration.ApiKey = _stripeSecrets.SecretKey;
                var tokenOptions = new TokenCreateOptions
                {
                    Card = new TokenCardOptions
                    {
                        Number = _dtoCreditDebitCard.Number,
                        ExpYear = _dtoCreditDebitCard.ExpYear,
                        ExpMonth = _dtoCreditDebitCard.ExpMonth,
                        Cvc = _dtoCreditDebitCard.Cvc,
                        Name = _dtoCreditDebitCard.Name,
                        AddressLine1 = _dtoCreditDebitCard.AddressLine1,
                        AddressLine2 = "",
                        AddressCity = _dtoCreditDebitCard.AddressCity,
                        AddressZip = _dtoCreditDebitCard.AddressZip,
                        AddressState = _dtoCreditDebitCard.AddressState,
                        AddressCountry = _dtoCreditDebitCard.AddressCountry,
                        Currency = _dtoCreditDebitCard.Currency
                    }
                };
                Tokenservice = new TokenService();
                stripeToken = Tokenservice.Create(tokenOptions);
                return stripeToken.Id;
            }
            catch (StripeException ex)
            {
                Console.Write("Error al crear el token" + ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public bool MakePayment(string token)
        {
            try
            {
                StripeConfiguration.ApiKey = _stripeSecrets.SecretKey;
                var options = new ChargeCreateOptions
                {

                    Amount = _dtoCreditDebitCard.Amount,
                    Currency = _dtoCreditDebitCard.Currency,
                    Description = _dtoCreditDebitCard.Descripcion,
                    Source = token,
                    StatementDescriptor = _dtoCreditDebitCard.DetailsDescripcion,
                    Capture = true,
                    ReceiptEmail = _dtoCreditDebitCard.Email,
                };
                //Make Payment
                var service = new ChargeService();
                charge = service.Create(options);
                if (charge.Status.ToLower().Equals("succeeded"))
                {
                    return true;
                }
                return false;
            }
            catch (StripeException ex)
            {
                Console.Write("Payment Gateway" + ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                Console.Write("Payment Gatway (CreateCharge)" + ex.Message);
                throw ex;
            }
        }
        public Charge ProccessPayment()
        {
            CancellationTokenSource tokenSource = new CancellationTokenSource();
            CancellationToken token = tokenSource.Token;
            try
            {
                var tokenGenerated = CreateToken();
                Console.Write("Payment Gateway" + "Token :" + tokenGenerated);
                isTransectionSuccess = tokenGenerated != null && MakePayment(tokenGenerated);
                return charge;
            }
            catch (StripeException ex)
            {
                Console.Write("Payment Gateway" + ex.Message);
                throw;
            }
            catch (Exception ex)
            {
                Console.Write("Payment Gateway" + ex.Message);
                throw;
            }
            finally
            {
                if (isTransectionSuccess)
                {
                    Console.Write("Payment Gateway" + "Payment Successful ");
                }
                else
                {
                    Console.Write("Payment Gateway" + "Payment Failure ");
                }
            }
        }
    }
}
