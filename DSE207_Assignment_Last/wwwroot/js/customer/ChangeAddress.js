$(function () {
    $.ajax({
        type: "GET",
        url: "/CustomerProfilesFunction/GetuserInfo",
        success: function (data) {
            console.log(data)
          
            $("#Address_Line1").val(data.addressLine1)
            $("#Address_Line2").val(data.addressLine2)
            $("#Address_City").val(data.city)
            $("#Address_State").val(data.state)
            $("#Address_PostCode").val(data.zipCode)
            $("#Address_Phone").val(data.phoneNumber)
            $("#country").val(data.country);

        }
    })
})
