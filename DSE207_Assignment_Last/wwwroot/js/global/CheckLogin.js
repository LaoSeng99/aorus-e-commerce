$(function () {

    CheckLogin()
    function getSideCart() {
        $.get("/CustomerCartFunction/getCartItemCount", function (data) {

            $(".cartIcon").html(`
                        <span class="cartCountBg">
               ${data}
            </span>

             <i id="open-panel" class=" SideCart fa fa-shopping-cart " style="font-size:30px"></i>
          <!-- Start of slide cart-->
    <div class="cart-panel">
        <!-- slide cart header -->
        <div class="cart-header">
            <!-- close Icon-->
            <i data-v-ecfbc8e2="" id="close-panel" style="font-size:36px;" class="fa fa-times"></i>
            <!-- header content-->
            <div style="float:right;padding-right:15px;">
                <h3 class="fontAorus">Cart</h3>
            </div>
            <!-- end of header content-->
        </div>
        <!-- slide cart content -->
        <div class="cart-content fontContent">
            <!-- entire products row -->
            <div class="products">
                <!-- each product row -->
         </div>

            <!-- Cart Check out  -->
            <div class="checkout-button">
                <a class="raise" href="/CustomerCart/CartList">
                    <!-- to the check out page or details -->
                    Details & Checkout
                    <i class="fa fa-arrow-right" style="font-size:24px; font-weight:300"></i>
                </a>
            </div>
        </div>
       </div>
       <!-- show shadow -->
      <div class="cartShadow"></div>
<div class="cartScript"></div>
                        
`).show(function () {

                $.get("/CustomerCartFunction/getCartItem", function (data) {
          


                    if (data.length == 0) {

                        $(".products").append(`
                        <h1>No products in the cart. </h1>
                        `)
                        $(".checkout-button").children("a").attr("href", "/ProductList?category=all").text("Add Some Product");

                    } else {

                        $.each(data, function (count, item) {
                       
                            var totalPrice = ((item.cartDetails.product.price *
                                ((100 - item.cartDetails.product.discount) / 100)) *
                                item.cartDetails.qty).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR","RM");
                      
                            $(".products").append(`
    <div class="product side_ProductName" data-productId="${item.cartDetails.product.productId}">
        <!-- Product Image -->

       <a href="/productdetails?productId=${item.cartDetails.product.productId}"> <img width="150" height="100"src="${item.image.imageUrl}" alt="ipad"></a>
        <div style="padding:8px;width:64%">
            <!-- Product Name -->
            <span class="side_cart_productName" style="font-size:20px">
                    <a href="/productdetails?productId=${item.cartDetails.product.productId}" class="fontContent" style="color:white"> ${item.cartDetails.product.name}</a>
             <br />
                <!-- Product Price -->
                <strong style="font-size:18px;">
                    Total Price:
                    <span class="sideTotalPrice-${item.cartDetails.cartDetailsId} fontAorus"> ${totalPrice}</span>
                </strong>
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
                <button value="y" style="color:white" data-CartId="${item.cartDetails.cartDetailsId}" class="btn btn-black btn_Confirmation fontAorus">Yes</button>
                <button value="n" style="color:white" class="btn btn-black btn_Confirmation fontAorus">No</button>

            </div>

        </div>
        <!-- trash icon/delete icon-->
        <i class="side_cart_row_delete fa fa-trash side-cart-trash-icon"></i>
    </div>
    <!-- end of each product row -->
                `)

                        })
                    }

                    $(".cartScript").html(`
        <script src ="/js/global/Side_Cart.js" ></script>`)

                });
            });
        })

    }
    function CheckLogin() {
        $.get("/CustomerProfilesFunction/CheckLogin", function (data) {
            if (data == true) {

                $("main").fadeIn(400)
                $(".userLink.GA-menu-link")
                    .attr("href", "/Customer_Profiles/Overview")
                    .parent().after(`
                     <span data-v-ecfbc8e2=""  class="logoutIcon" id="user-icon">
                            <a data-v-ecfbc8e2="" href="/CustomerProfilesFunction/Logout" class="userLink GA-menu-link">
                                <i class="fa fa-sign-out" style="font-size:30px"></i>
                            </a>
                        </span>`)
                getSideCart()

            } else {
                if (document.URL.split("/")[3] == "Customer_Profiles" ||
                    document.URL.split("/")[3] == "CustomerCart")

                    location.href = "/CustomerLogin/Login"
              
            }
        })
    }

})