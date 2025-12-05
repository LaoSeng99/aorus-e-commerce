

$(function () {
    function LoadingAnimate() {
        $("#loading-div").addClass("active show");
        setTimeout(function () {
            $("#loading-div").removeClass("active show");
        }, 600);
    }
    function getSubTotal() {
        $.ajax({
            type: "GET",
            url: "/CustomerCartFunction/getSubTotal",
            async: false,
            success: function (data) {
                var shippingfee = $(".shippingSelect").val() == "" ? 0 : $(".shippingSelect").val();
                var subTotal = data.toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

                shippingfee = shippingfee * $(".sellerRow").length
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
    function RemovingOutOfStock() {
        $.get("/CustomerCartFunction/CheckOutOfStock", function (data) {

            $.each(data, function (count, item) {
                $(`#cart_Row_Error_Msg-${item}`).text("** Product is Out of Stock,already remove from your cart").fadeIn(300)

            })
        })
    }
    function RemovingInvalidProduct() {
        $.get("/CustomerCartFunction/CheckIsInvalid", function (data) {

            $.each(data, function (count, item) {
                $(`#cart_Row_Error_Msg-${item}`).text("** Product is Invalid, already remove from your cart").fadeIn(300)

            })
        })
    }
    function UpdateProductStock() {
        $.get("/CustomerCartFunction/CheckStoct", function (data) {
            console.log(data)
            $.each(data, function (count, item) {
                $(`#cart_Row_Error_Msg-${item.cartDetailsId}`).text("** Product stock has updated").fadeIn(300)
                $(`.cartQtyInput[data-cartrowid='${item.cartDetailsId}']`).val(item.qty)
                $(`.cartQtyInput[data-productstock='${item.qty}']`).val(item.qty)
            })
        })
    }
    $(".shippingSelect").change(function () {
        $("#shipError").fadeOut(300)
        getSubTotal()
    })
    $.get("/CustomerCartFunction/getCartDetailsItem", function (data) {
        LoadingAnimate()
        getSubTotal()
        getCartItem()

        $.each(data, function (count, item) {

            $("#bigdetails").append(`

<div class="sellerRow detailCartList-${item.sellers.sellerId}" style="padding-top:20px;">
<div style="display:flex;background-color: rgba(255,255,255,0.1);width: 100%;padding:10px;border-radius:50px

"><img src="/Image/Customer/UserImage.jpg" height="50" width="50" style="border-radius:100%;margin-right:10px;">

<h1 ">${item.sellers.name}</h1>

</div>
               </div>`)
            $.each(item.listDetails, function (count, details) {


                var totalPrice = ((details.cartDetails.product.price *
                    ((100 - details.cartDetails.product.discount) / 100)) *
                    details.cartDetails.qty).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

                $(`.detailCartList-${item.sellers.sellerId}`).append(`
    <div class="product side_ProductName">
        <!-- Product Image -->

       <a href="/productdetails?productId=${details.cartDetails.product.productId}"> <img width="200" height="120"src="${details.image.imageUrl}" alt="ipad"></a>
        <div style="padding:8px;width:64%">
            <!-- Product Name -->
            <span class="side_cart_productName" style="font-size:20px">
                    <a href="/productdetails?productId=${details.cartDetails.product.productId}" class="fontContent" style="color:white"> ${details.cartDetails.product.name}</a>
             <br />
                <!-- Product Price -->
               <strong style="font-size:18px;margin-top:10px;">
                   Per Unit Price:
              <del style="font-size:14px;color:darkgray" class="fontAorus">RM ${details.cartDetails.product.price}</del>
                  </strong>
        
          <strong style="font-size:18px;margin-bottom:5px;" class="fontAorus">RM ${(details.cartDetails.product.price * ((100 - details.cartDetails.product.discount) / 100)).toFixed(2)}</strong>
                     </br>          
                <strong style="font-size:18px;">
                    Total Price:
                    <span style="font-size:24px;color:white" class="sideTotalPrice-${details.cartDetails.cartDetailsId} fontAorus"> ${totalPrice}</span>
                </strong>
            </span>
            <br />
            <span class="side_cart_productName">
                <!-- Product Quantity -->
                Quantity :
            </span>
            <!-- Minus button -->
            <i data-CartId="${details.cartDetails.cartDetailsId}" style="margin-left:5px;" class="qtyBtn fa fa-minus sideCartMinus"></i>
            <!-- this cart row quantity -->
              <input class="cartQtyInput"
                date-CartRowId="${details.cartDetails.cartDetailsId}" 
                data-productStock="${details.cartDetails.product.stock}"
                data-productDiscount="${details.cartDetails.product.discount}"
                data-productPrice="${details.cartDetails.product.price}"
                    oninput="javascript: if (this.value <0) this.value =1;"
           type="number" style="font-size:18px;margin:10px;background-color:transparent;width:50px;color:white" class="fontContent" value="${details.cartDetails.qty}" />

          <!-- Plus button -->
            <i data-CartId="${details.cartDetails.cartDetailsId}" class=" qtyBtn fa fa-plus sideCartPlus"></i>

            <br />
            <span id="cart_Row_Error_Msg-${details.cartDetails.cartDetailsId}" style="color:orangered"></span>
        </div>
        <div class="confirmation" style="padding:8px; display:none;text-align:center;">
            <span style="color:orangered;font-size:18px;">Do you want to delete</span>

            <br>
            <h5>
                ${details.cartDetails.product.name}
            </h5>
            <div style="width:100%;justify-content:space-evenly;display:flex">
                <button value="y" style="color:white" data-CartId="${details.cartDetails.cartDetailsId}" class="btn btn-black btn_Confirmation fontAorus">Yes</button>
                <button value="n" style="color:white" class="btn btn-black btn_Confirmation fontAorus">No</button>

            </div>

        </div>
        <!-- trash icon/delete icon-->
        <i class="side_cart_row_delete fa fa-trash side-cart-trash-icon"></i>
    </div>
    <!-- end of each product row -->
                `)

            })
        })

        $(".cartScript").html(`
        <script src ="/js/global/Side_Cart.js?2" ></script>`)

        $(".cartQtyInput").keyup(function () {

            var productDiscount = $(this).attr("data-productDiscount")
            var productPrice = $(this).attr("data-productPrice")
            var cartDetailId = $(this).attr("date-CartRowId");
            var inputQty;

            if (parseInt($(this).val()) > parseInt($(this).attr("data-productStock"))) {
                inputQty = $(this).attr("data-productStock");
                $(`#cart_Row_Error_Msg-${cartDetailId}`).text("** has reach the product stock")

            } else {
                inputQty = $(this).val();
                $(`#cart_Row_Error_Msg-${cartDetailId}`).text("")

            }

            var totalPrice = ((productPrice *
                ((100 - productDiscount) / 100)) *
                inputQty).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

            $(this).val(inputQty)

            $(`.sideTotalPrice-${cartDetailId}`).text(totalPrice)

        })

        $(".cartQtyInput").change(function () {
            var inputQty = $(this).val();
            var cartDetailId = $(this).attr("date-CartRowId");
            $.post("/CustomerCartFunction/CartListQtyChange",
                {
                    cartDetailsId: cartDetailId,
                    InputQty: inputQty
                }, function (data) {
                    getSubTotal()
                })

        })

    }).done(function () {
        RemovingOutOfStock()
        RemovingInvalidProduct()
        UpdateProductStock()
    });

    GetCustomerAddress()

    function GetCustomerAddress() {
        $.get("/CustomerCartFunction/getAddress", function (data) {
            if (data.addressLine1 != "" && data.city != "" && data.state != "" && data.state != "") {
                $("#cusAddress").html(`
${data.addressLine1},
${data.addressLine2},
${data.city} ${data.zipCode},${data.state}
${data.country}
`)
            }
        })


    }

    $(".processToCheckout").click(function () {
        $("#shipError").fadeOut(300)
        var shipping = $(".shippingSelect").val()
        var shipAdress = $("#cusAddress").html()
        if (shipAdress.replaceAll(",", "").trim() == "") {
            $(".custom-model-main").addClass('model-open');

            $(".closeSuccess-btn, .bg-overlay").click(function () {
                $(".custom-model-main").removeClass('model-open');
                location.href = "/Customer_Profiles/Change_address"
          
            });
            return;
        }

        if ($("#subTotal").text() == "No Item") {
            location.href = "/ProductList?category=all"
        }
        else if (shipping == "") {
            $("#shipError").fadeIn(300)
            return;
        }
        else {
            $.get("/Payment/CreateOrder", { ShippingFee: shipping }, function (data) {

                location.href = "/PaymentCheckOutPage?ordersid=" + data.split("|")[0] + "cartId=" + data.split("|")[1].replace("&", "")
            })
        }
    })


});

