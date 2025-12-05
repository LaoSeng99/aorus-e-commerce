$(function () {

    //Giving Cart Icon id == "open-panel" declare to openPanelButton
    //Giving the close icon id =="close-panel" declare to closePanelButton
    var openPanelButton = $("#open-panel,.cartCountBg");
    var closePanelButton = $("#close-panel,.cartShadow");
    var cartPanel = $(".cart-panel");

    openPanelButton.click(function () {
        $(".cartShadow").fadeIn(300)
        cartPanel.addClass("open");
        openPanelButton.addClass("hide")
    })
    closePanelButton.click(function () {
        $(".cartShadow").fadeOut(200)
        cartPanel.removeClass("open");
        openPanelButton.removeClass("hide");
    })
    //When Click the minus button

    $(".sideCartMinus").click(function () {
        //Get Cart Row Id

        var cart_row_Id = $(this).attr("data-CartId");
        //Get Cart Row Quantity
        var cart_row_qty = $(this).next().val();

        if (cart_row_qty == 1) {
            //Css Changing
            $(this).css("cursor", "not-allowed")
            //Animation
            $(`#side_cart_row_delete-${cart_row_Id}`).addClass("shakeKeyframe")
            $(`#side_cart_row_delete-${cart_row_Id}`).on("webkitAnimationEnd oAnimationEnd msAnimationEnd animationend", function (e) {
                $(this).removeClass("shakeKeyframe");
                $(this).addClass("finished");
            })
            //Error Msg show
            $(`#cart_Row_Error_Msg-${cart_row_Id}`).text("** Wish to delete this product from your cart?")

        } else {


            $.post("/CustomerCartFunction/sideCartMinus",
                { cartDetailsId: cart_row_Id },
                function (data) {

                    var totalPrice = ((data.product.price *
                        ((100 - data.product.discount) / 100)) *
                        data.qty).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

                    $(`#cart_Row_Error_Msg-${cart_row_Id}`).text("")

                    $(".sideTotalPrice-" + cart_row_Id).text(` ${totalPrice}`)
                    getSubTotal()
                })
            $(this).next().val(cart_row_qty - 1);

        }
    })
    //When Click the plus button
    $(".sideCartPlus").click(function () {
        //Get Cart Row Id
        var plus = $(this)
        var cart_row_Id = $(this).attr("data-CartId");
        //Get Cart Row Quantity
        var cart_row_qty = $(this).prev().val();
        $.post("/CustomerCartFunction/getProductStock",
            { cartDetailsId: cart_row_Id },
            function (data) {
                if (cart_row_qty == data) {
                    //Error Msg show

                    $(".sideCartMinus").css("cursor", "not-allow")
                    $(`#cart_Row_Error_Msg-${cart_row_Id}`).text("** has reach the product stock")

                } else {
                    $.post("/CustomerCartFunction/sideCartAdd",
                        { cartDetailsId: cart_row_Id },
                        function (data) {

                            $(".sideCartMinus").css("cursor", "")
                            $(`#cart_Row_Error_Msg-${cart_row_Id}`).text("")
                            plus.prev().val(parseInt(cart_row_qty) + 1);

                            var totalPrice = ((data.product.price *
                                ((100 - data.product.discount) / 100)) *
                                data.qty).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

                            $(".sideTotalPrice-" + cart_row_Id).text(` ${totalPrice}`)
                            getSubTotal()
                        })
                }
            })

        /*}*/
    })

    function getSubTotal() {
        $.ajax({
            type: "GET",
            url: "/CustomerCartFunction/getSubTotal",
            async: false,
            success: function (data) {
                var shippingfee = $(".shippingSelect").val() == "" ? 0 : $(".shippingSelect").val();
                var subTotal = data.toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

                $("#subTotal").text(subTotal);


                var grandTotal = shippingfee == 0 ? "-" : parseFloat(data) + parseInt(shippingfee);

                grandTotal = grandTotal < shippingfee ? "-"
                    : grandTotal.toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");



                $("#grandTotalNum").text(grandTotal)

            }
        })

    }
    function getCartItem() {
        $.get("/CustomerCartFunction/getCartItemCount", function (data) {
            $(".cartItemCount").text(`${data} Items`)


        })
    }

    //When click the trash icon
    $(".side_cart_row_delete").click(function () {


        //Get Cart Row Id

        //this icon last two element == Product content fadeOut
        $(this).prev().prev().fadeOut(400, function () {
            //fadeOut complete, 
            //delete confirmation fadeIn
            $(this).next().fadeIn(400)
            //after fadeIn declare a function for btn Confirmation
            $(".btn_Confirmation").click(function () {
                var thisValue = $(this).val();

                //if Yes, remove
                if (thisValue == "y") {
                    var cart_row_Id = $(this).attr("data-CartId");
                    //here is display remove
                    $(this).parents(".side_ProductName").fadeOut(400, function () {
                        //here for Ajax delete from cart
                        var thisRow = $(this);
                        $.post("/CustomerCartFunction/sideCartDelete",
                            { cartDetailsId: cart_row_Id },
                            function (data) {

                                $.get("/CustomerCartFunction/getCartItemCount", function (data) {
                                    $(".cartCountBg").text(data)
                                    getSubTotal()
                                    getCartItem()
                                })
                            }).done(function () {
                                console.log(thisRow.parent().children(".product").length)

                                if (thisRow.parent().children(".product").length == 1) {

                                    thisRow.parents(".sellerRow").remove();
                                } else {
                                    thisRow.remove();
                                }

                            })




                    });
                } else {
                    //confirmation fadeOut
                    $(this).parents(".confirmation").fadeOut(400, function () {
                        //fadeOut complete,
                        //Product content fadeIn
                        $(this).prev().fadeIn(400);
                    })
                }
            })

        })




    })
   
})

