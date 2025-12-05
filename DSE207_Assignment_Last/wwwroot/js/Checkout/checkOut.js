$(function () {

    var orderId = document.URL.split("ordersid=")

    var orderArray = orderId[1].split("cartId=");
 
    var cartId = orderArray.pop()
    orderArray = orderArray[0].split("&")
    orderArray.pop()

    $.post("/Payment/GetAllOrder", { OrderArray: orderArray }, function (data) {
        console.log(data)

        $("#fname").val(`${data[0].cart.customers.nickname} `)
        $("#email").val(`${data[0].cart.customers.email}`)
        $("#adr").val(`${data[0].cart.customers.addressLine1},${data[0].cart.customers.addressLine2}`)
        $("#city").val(`${data[0].cart.customers.city}`)
        $("#state").val(`${data[0].cart.customers.state}`)
        $("#zip").val(`${data[0].cart.customers.state}`)
        var sum = 0;
        $.each(data, function (count,item) {
       
            sum += item.grandTotal;
            console.log(item.grandTotal)

        })

        $("#TotalPrice").val(sum.toFixed(2))
        $(".price").text(sum.toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM"))
    })

    $('.cardnumber').on('keyup change', function () {
        t = $(this);

        //focuses next input when the fourth number is put in
        if (t.val().length > 3) {

            t.next().focus();
            if (t.attr("id") == "ccnum4") {
                console.log("hi")
                $("#expmonth").focus();
            }
        }
    });

    $(".bottomThree").on('keyup change', function () {
        console.log("hi")
        t = $(this);
        if (t.val().length == 2) {
            t.parent().next().find(".bottomThree").focus();
        }
    });
    $("#cancelBtn").click(function () {
        location.href = "/Customer_Profiles/Overview"
    })
    $("#submitBtn").click(function () {


        var creditCard = new Object({

            Number: $("#ccnum1").val() + $("#ccnum2").val() + $("#ccnum3").val() + $("#ccnum4").val(),
            ExpMonth: $("#expmonth").val(),
            ExpYear: $("#expyear").val(),
            Cvc: $("#CVC").val(),
        })
        $.post("/Payment/PaymentCheckOutPage", { creditCard: creditCard, OrderId: orderArray, CartId: cartId }, function (data) {
            if (data == true) {
                location.href = "/Payment/PaymentSuccess";
            } else {
                location.href = "/Payment/PaymentFailure?Ms=" + data;
            }
        })
        console.log(creditCard)
    })
    $(".bottomThree,.cardnumber,#cname").on("keyup change", function () {
        var Count = 0;
        $(".bottomThree,.cardnumber,#cname").filter(function () {
            var value = $(this).val()
            Count = value.length > 1 ? Count + 1 : Count;
            console.log(Count)

        });

        $("#submitBtn").prop("disabled", (Count != 8))
    })
})