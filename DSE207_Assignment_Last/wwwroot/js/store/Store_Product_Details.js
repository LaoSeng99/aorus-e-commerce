// Loading Description From Backend



//Changing Description Position

$(function () {
    function LoadingAnimateTIMER(TIMER) {
        $("#loading-div").addClass("active show");
        setTimeout(function () {
            $("#loading-div").removeClass("active show");
        }, TIMER);
    }

    var ProductId = document.URL.split("productId=")[1];
    console.log(ProductId)
    if (typeof ProductId === "undefined" || ProductId == "") {
        location.href = "/ProductList?category=all&sortby=featured"
    }

    $.post("/StoreFunction/GetProductDetails", { ProductId: ProductId }, function (data) {
        LoadingAnimateTIMER(1600)
        console.log(data)
        if (data == "ProductNotFound") {
            location.href = "/ProductList?category=all&sortby=featured"
        }
        if (data.product.stock == 0) {
            $("#addToCart").hide();
        }
        var disprice = data.product.price.toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");
        var afterDis = (data.product.price * ((100 - data.product.discount) / 100)).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");
        //Name
        $(".Detailsrow .col-1 h2").text(data.product.name);
        //Title
        $(".Detailsrow .col-1 h3").text(data.product.title);

        $(".Detailsrow .col-1 #Disprice").text(disprice);
        $(".Detailsrow .col-1 #Discount").text("- " + data.product.discount + " %");
        $(".Detailsrow .col-1 .afterDisPrice").text(afterDis);
        $(".Detailsrow .col-1 .remainStock").text("Remaining Stock : " + data.product.stock).attr("data-stock", data.product.stock);

        $.each(data.images, function (count, item) {
            if (count == 0) {
                $("#BigShowImage").attr("src", item.imageUrl)
            }
            $(`#productImage img:nth-child(${count + 1})`).fadeIn(300).attr("src", item.imageUrl)

        })

        $("#Description").html(
            data.product.description
        )


    }).done(function () {

        $("#productDetails").fadeIn(300)
    })

    var customerLog;
    $.get("/CustomerProfilesFunction/CheckLogin", function (data) {
        if (data != true) {
            customerLog = false;
            return;
        }
        customerLog = true;
        $("#addToCart").addClass("btn-yellow").removeClass("btn-black").text("Add To Cart");
    })
    $.get("/StoreFunction/GetFourRandomFourPick", function (data) {

        $.each(data, function (count, item) {
            console.log(item)
            var name = item.product.name.length > 20 ? item.product.name.substring(0, 20) + "..." :
                item.product.name
            $("#BestFour").append(`
                      <div data-v-e4caeaf8="" aria-hidden="false" class="slick-slide slick-active" style="outline: none; width: 350px;">
                                <div data-v-e4caeaf8="">
                                    <div data-v-eb150444="" data-v-e4caeaf8="" tabindex="-1" class="slide" style="width: 100%; display: inline-block;">
                                        <div data-v-eb150444="" data-v-e4caeaf8="" class="product-div">
                                            <a data-v-eb150444="" data-v-e4caeaf8="" href="/productdetails?productId=${item.product.productId}" class="GA-Gaming-Gears-Link">
                                                <div data-v-eb150444="" data-v-e4caeaf8="" class="box">
                                                    <img data-v-eb150444="" data-v-e4caeaf8="" alt="" src="${item.images.imageUrl}" lazy="loaded" height="260" width="260">
                                                    <div data-v-eb150444="" data-v-e4caeaf8="" class="name active">
                                                        <span data-v-eb150444="" data-v-e4caeaf8=""></span>
                                                        ${name}
                                                    </div>
                                                </div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
`)
        })
    })
    //reach limit
    //$(".custom-model-main").addClass('model-open').delay(1500).fadeOut(1000, function () {
    //    $(".custom-model-main").removeClass('model-open').show()

    //});


    $("#addToCart").click(function () {
        $("#ErrorMsg").fadeOut(300).text("");
        //Done
        var inputValue = $("#detailsInputQty").val();


        if (customerLog == false) {
            location.href = "/CustomerLogin/Login"
            return;
        }
        else {
            $.post("/StoreFunction/DetailsPageAddCart", { productId: ProductId, inputQty: inputValue }, function (data) {
                if (data == false) {
                    //First
                    $('.cart-content').animate({
                        scrollTop: $(".products").offset().top
                    }, 'slow');

                    $(".cartShadow").fadeIn(300)
                    $(".cart-panel").addClass("open")
                    $("#open-panel,.cartCountBg").addClass("hide")
                    $("#ErrorMsg").text("** Has reach the remaining stock").fadeIn(300)


                    //If Stock Reach the limit 
                    //Show Cart Page Modal
                    setTimeout(function () {


                        $('.cart-content').animate({
                            scrollTop: $(`.side_ProductName[data-productid='${ProductId}']`).offset().top - 180
                        }, 'slow');


                    }, 800)
                    setTimeout(function () {

                        const fade = setInterval(function () {
                            $(`.side_ProductName[data-productid='${ProductId}']`).fadeOut(600, function () {
                                $(this).fadeIn(600);
                            })
                        })
                        setTimeout(function () {
                            $(`.side_ProductName[data-productid='${ProductId}']`).fadeIn(600);
                            clearInterval(fade)
                        }, 1000)

                    }, 1500)

                } else {

                    //Success Added

                    $.get("/CustomerCartFunction/getCartItemCount", function (data) {
                        $(".products").html("")

                        $(".cartCountBg").text(data)

                    }).done(function () {

                        $.get("/CustomerCartFunction/getCartItem", function (data) {

                            $.each(data, function (count, item) {
                                var totalPrice = ((item.cartDetails.product.price *
                                    ((100 - item.cartDetails.product.discount) / 100)) *
                                    item.cartDetails.qty).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

                                $(".products").append(`
    <div class="product side_ProductName" data-productId="${item.cartDetails.product.productId}">
        <!-- Product Image -->
              <img width="150" height="100"src="${item.image.imageUrl}" alt="ipad">
        <div style="padding:8px;width:64%">
                  <!-- Product Name -->
                  <span class="side_cart_productName" style="font-size:20px">
                <a href="#" style="color:white"> ${item.cartDetails.product.name}</a>
                    <br />
                    <!-- Product Price -->
                <strong style="font-size:18px;">
                    Total Price:
               <span class="sideTotalPrice-${item.cartDetails.cartDetailsId} fontAorus"> ${totalPrice}</span> </strong>
            </span>
            <br />
            <span class="side_cart_productName">
                <!-- Product Quantity -->
                Quantity :
            </span>
            <!-- Minus button -->
            <i data-CartId="${item.cartDetails.cartDetailsId}" style="margin-left:5px;" class="qtyBtn fa fa-minus sideCartMinus"></i>
            <!-- this cart row quantity -->
            <input readonly style="font-size:18px;margin:10px;background-color:transparent;width:40px;color:white" class="fontContent" value="${item.cartDetails.qty}" />
            <!-- Plus button -->
            <i data-CartId="${item.cartDetails.cartDetailsId}" class=" qtyBtn fa fa-plus sideCartPlus"></i>

            <br />
            <span id="cart_Row_Error_Msg-${item.cartDetails.cartDetailsId}" style="color:orangered"></span>
        </div>
        <div class="confirmation" style="padding:8px; display:none;text-align:center;">
            <span style="color:orangered;font-size:18px;">Do you want to delete</span>

            <br>
            <h5>
                ${item.cartDetails.product.name}
            </h5>
            <div style="width:100%;justify-content:space-evenly;display:flex">
                <button value="y" style="color:white"data-CartId="${item.cartDetails.cartDetailsId}" class="btn btn-black btn_Confirmation fontAorus">Yes</button>
                <button value="n" style="color:white" class="btn btn-black btn_Confirmation fontAorus">No</button>

            </div>

        </div>
        <!-- trash icon/delete icon-->
        <i  class="side_cart_row_delete fa fa-trash side-cart-trash-icon"></i>
    </div>
    <!-- end of each product row -->
                `)
                            })
                            $(".cartScript").html(`
                                       <script src ="/js/global/Side_Cart.js" ></script>`)
                        }).done(function () {

                            $(".checkout-button").children().text("Details & Checkout").attr("href", "/CustomerCart/CartList")
                            $(".cartShadow").fadeIn(300)
                            $(".cart-panel").addClass("open")
                            $("#open-panel,.cartCountBg").addClass("hide")
                        });
                    })


                    //Show Cart Page Modal

                }

            })
        }
        //Add To Cart


    })

    $(".DetailsMinus").click(function () {
        var inputValue = $(this).next().val()

        if (inputValue == 1) {
            $("#ErrorMsg").text("** Cannot less than zero").fadeIn(300)
            return;
        } else {
            $("#ErrorMsg").text("").fadeOut(300)

            inputValue--;
            $(this).next().val(inputValue)

        }
    })
    $(".DetailsPlus").click(function () {
        $("#ErrorMsg").text("").fadeOut(300)
        var inputValue = $(this).prev().val()

        var productStock = $(".Detailsrow .col-1 .remainStock").attr("data-stock")

        if (parseInt(inputValue) >= parseInt(productStock)) {
            $("#ErrorMsg").text("** Has reach the remaining stock").fadeIn(300)
            return;
        }
        else {
            inputValue++
            $(this).prev().val(inputValue)
        }








    })

    $("#ShowDescription").css("border-bottom", "solid 4px black");

    $("#productImage img").mouseenter(function () {

        $("#BigShowImage").attr("src", $(this).attr("src"))

    })


    $("#detailsInputQty").keyup(function () {

        var inputQty;

        if (parseInt($(this).val()) > parseInt($(".remainStock").attr("data-stock"))) {
            inputQty = $(".remainStock").attr("data-stock");
            $("#ErrorMsg").text("** Has reach the quantity limit").fadeIn(300)

        } else {
            inputQty = $(this).val();
            $("#ErrorMsg").text("").fadeOut(300)

        }

        $(this).val(inputQty)



    })

})

