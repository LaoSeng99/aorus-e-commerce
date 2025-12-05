using Newtonsoft.Json;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace DSE207_Assignment_Last.Models
{
    public class _CreditCard
    {
        [JsonProperty("exp_month")]
        public long expMonth { get; set; }
        public long ExpMonth
        {
            get
            {
                return expMonth;
            }
            set
            {
                if (expMonth != value)
                {
                    expMonth = value;
                    NotifyPropertyChanged();
                }
            }
        }
        [JsonProperty("exp_year")]
        public long expYear { get; set; }
        public long ExpYear
        {
            get
            {

                return expYear;
            }
            set
            {
                if (expYear != value)
                {
                    expYear = value;
                    NotifyPropertyChanged();
                }
            }
        }
        [JsonProperty("number")]
        public string number { get; set; }
        public string Number
        {
            get
            {
                return number;
            }
            set
            {

                if (number != value)
                {
                    number = value;
                    NotifyPropertyChanged();
                }
            }
        }

        [JsonProperty("address_city")]
        public string AddressCity { get; set; }

        [JsonProperty("address_country")]
        public string AddressCountry { get; set; }

        [JsonProperty("address_line1")]
        public string AddressLine1 { get; set; }

        [JsonProperty("address_line2")]
        public string AddressLine2 { get; set; }

        [JsonProperty("address_state")]
        public string AddressState { get; set; }

        [JsonProperty("address_zip")]
        public string AddressZip { get; set; }

        [JsonProperty("currency")]
        public string Currency { get; set; }

        [JsonProperty("cvc")]
        public string Cvc { get; set; }

        [JsonProperty("name")]
        public string name { get; set; }
        public string Name
        {
            get
            {

                return name;
            }
            set
            {

                if (name != value)
                {
                    name = value;

                    NotifyPropertyChanged();
                }
            }
        }
        [JsonProperty("metadata")]
        public object MetaData { get; set; }

        [JsonProperty("issuing_card")]
        public string IssuingCardId { get; set; }
        public string Email { get; set; }
        public string Descripcion { get; set; }
        public string DetailsDescripcion { get; set; }
        public long Amount { get; set; }
        public string BackgroundColor { get; set; }
        public bool isVisible { get; set; }
        public bool IsVisible
        {
            get
            {
                return isVisible;
            }
            set
            {
                if (isVisible != value)
                {
                    isVisible = value;

                    NotifyPropertyChanged();
                }
            }
        }
        protected virtual void NotifyPropertyChanged([CallerMemberName] string propertyName = "")
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
        public event PropertyChangedEventHandler PropertyChanged;
    }
}
