$(function () {
    //Get Value On URL
    var SearchValue = document.URL.split("search=")[1]
    var sort = document.URL.toLowerCase().split("sortby=")[1];
    //Checking
    if (typeof SearchValue === "undefined") {
        SearchValue = ""
    }
    else {
        SearchValue = SearchValue.replaceAll("%20", " ")
    }
    if (typeof sort === "undefined") {
        sort = "featured"
    }
    if (SearchValue.includes("&")) {
        SearchValue = SearchValue.replaceAll(`&sortby=${sort}`, "")

    }
    //sorting Orderby
    function CheckingActive(Object) {
        if (Object.hasClass("active")) {
            Object.removeClass("active");
        } else {
            Object.addClass("active");
        }
    }
    function getSearchValue() {
        var SearchValue = document.URL.split("search=")[1]
        if (typeof SearchValue === "undefined") {
            SearchValue = ""
        }
        if (SearchValue.includes("&")) {
            SearchValue = SearchValue.replaceAll(`&sortby=${sort}`, "")

        }
        return SearchValue;
    }

    $(".filter-select").click(function () {
        CheckingActive($(this).children(".list"))
    })
    $(".filter-select .list > div").click(function () {

        $(".col-product").remove();
        $(".productAnime").css("display", "")

        var filtersearch = document.URL.toLowerCase().split("search=")[1]
        var filterSort = document.URL.toLowerCase().split("sortby=")[1];
        if (typeof filtersearch === "undefined") {
            filtersearch = ""
        } else {
            filtersearch = filtersearch.replaceAll("%20", " ")
        }
        if (typeof filterSort === "undefined") {
            filterSort = "featured"
        }
        if (filtersearch.includes("&")) {
            filtersearch = filtersearch.replaceAll(`&sortby=${filterSort}`, "")

        }

        var searchInpt = $("#SearchPageInput").val()


        window.history.replaceState(null, null, `?search=${searchInpt}&sortby=${$(this).attr("data-value")}`);


        getProductList(filtersearch, $(".pageValue.active").val(), $(this).attr("data-value").toLowerCase())

        $(".filter-select").children(".title").text($(this).text()).attr("data-value", $(this).attr("data-value"))


    })

    //Loading Animation
    function loadingAnimation() {
        $("#loading-div").addClass("active show")
        setTimeout(function () {
            $("#loading-div").removeClass("active").removeClass("show");

        }, 800);
    }
    //Checking Url
    function checkUrl() {
        var searchInpt = $("#SearchPageInput").val().trim()

        var sortby = $(".filter-select").children(".title").attr("data-value").trim().toLowerCase()

        window.history.replaceState(null, null, `?search=${searchInpt}&sortby=${sortby}`);


    }

    $("#SearchPageInput").val(SearchValue)
    // Add product
    function checkPageplace(object) {
        if ($(".pageBtn").length <= 5) {
            $(".pageBtn.first, .pageBtn.previous,.pageBtn.next, .pageBtn.last").attr("disabled", true)
            return;
        }
        if (object.val() == "1") {
            $(".pageBtn.first, .pageBtn.previous").attr("disabled", true)
        } else {
            $(".pageBtn.first, .pageBtn.previous").attr("disabled", false)
        }
        if (object.next().hasClass("next")) {
            $(".pageBtn.next, .pageBtn.last").attr("disabled", true)
        } else {
            $(".pageBtn.next, .pageBtn.last").attr("disabled", false)
        }
    }

    $("#SearchPageInput").keypress(function () {
        if (event.keyCode === 13) {
            $(".col-product").remove();
            $(".productAnime").css("display", "")

            var filterSort = document.URL.toLowerCase().split("sortby=")[1];

            if (typeof filterSort === "undefined") {
                filterSort = "featured"
            }
            PageBtnGenerate($(this).val(), filterSort)


        }
    })
    $(".searchInput").keypress(function (event) {

        if (event.keyCode === 13) {

            $(".col-product").remove();
            $(".productAnime").css("display", "")

            var filterSort = document.URL.toLowerCase().split("sortby=")[1];

            if (typeof filterSort === "undefined") {
                filterSort = "featured"
            }
            PageBtnGenerate($(this).val(), filterSort)


        }
    })
    $(".searchInput").keyup(function () {
        $("#SearchPageInput").val($(this).val())
    })
    function PageBtnGenerate(searchInput, sortby) {
        $(".pageValue").remove();
        loadingAnimation()
        checkUrl()


        $.post("/StoreFunction/SearchProductCount", { searchInput: searchInput }).done(function (data) {

            //Get Count Page
            if (data == 0) {

                setTimeout(function () {
                    $(".Noproduct-model").addClass('model-open').delay(1000).fadeOut(1000, function () {
                        $(".Noproduct-model").removeClass('model-open').show()

                    });
                }, 800)

                return;
            }
            var page = Math.ceil(parseInt(data) / 8)

            //Generate Page Button
            for (var i = 0; i < page; i++) {
                if (i + 1 == 1) {

                    $(".pageBtn.next").before(`
                <button data-v-5e0c66e7="" value="${i + 1}"class="pageBtn pageValue active">${i + 1} </button>
                    `)
                } else {
                    $(".pageBtn.next").before(`
                <button data-v-5e0c66e7=""value="${i + 1}" class="pageBtn pageValue">${i + 1} </button>
                    `)
                }
            }


            getProductList(searchInput, 1, sortby)

        }, function () {
            checkPageplace($(".pageValue.active"))

            //Click Page Button
            $(".pageValue").click(function () {
                if ($(this).hasClass("active")) {
                    return;
                }
                $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);


                $(".pageValue").removeClass("active");
                $(this).addClass("active")
                checkPageplace($(this))
                getProductList(searchInput, $(this).val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())

            })

        })


    }



    function getProductList(searchInput, currentPage, sort) {


        $(".product-box").parent().remove();
        $(".productAnime").css("display", "")



        $.ajax({
            type: "GET",
            url: "/StoreFunction/GetSearchProduct",
            data: { searchInput: searchInput, currentPage: currentPage, sortBy: sort },
            success: function (data) {
                $.each(data, function (count, item) {

                    $(".productAnime").fadeOut(200)
                    addProduct(item)
                })


                $(".AddToCartBtn").click(function () {
                    var btnProductId = $(this).attr("data-productId")
                    $.get("/CustomerProfilesFunction/CheckLogin", function (data) {
                        if (data == true) {

                            $.post("/StoreFunction/ProductListAddToCart", { ProductId: btnProductId },
                                function (data) {

                                    if (data == "success") {

                                        $.get("/CustomerCartFunction/getCartItemCount", function (data) {

                                            $(".cartCountBg").text(data)

                                        }).done(function () {
                                            $(".products").html("")

                                            $.get("/CustomerCartFunction/getCartItem", function (data) {

                                                $.each(data, function (count, item) {
                                                    var totalPrice = ((item.cartDetails.product.price *
                                                        ((100 - item.cartDetails.product.discount) / 100)) *
                                                        item.cartDetails.qty).toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

                                                    $(".products").append(`
    <div class="product side_ProductName">
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
                                    } else if (data == "reachTheLimit") {
                                        $(".custom-model-main").addClass('model-open').delay(1500).fadeOut(1000, function () {
                                            $(".custom-model-main").removeClass('model-open').show()

                                        });


                                    } else {
                                    }
                                })
                        }
                        else {
                            location.href = "/CustomerLogin/Login"
                        }
                    })
                })
  

            }

        })
    }
    function addProduct(object) {

        var name = object.product.name;
        name = name.length > 18 ? name.substring(0, 18) + "..." : name
        if (object.product.stock == 0) {
            $("#Product-Container").append(`
             <div data-v-5e0c66e7="" style="max-width:25%"class="col-product">
                                <div data-v-5e0c66e7="" class="product-box">
                                    <div data-v-5e0c66e7="" class="tag" style="display: none;">NEW</div>
                                    <div data-v-5e0c66e7="" class="img">
                                        <a data-v-5e0c66e7="" href="https://www.aorus.com/en-my/graphics-cards/GV-N4090AORUSX-W-24GD-rev-11" title="${object.product.name}">
                                            <img data-v-5e0c66e7="" alt="${object.product.name}"
                                             src="${object.images.imageUrl}" lazy="loaded" height="343" width="321">
                                        </a>
                                    </div>
                                    <div data-v-5e0c66e7="" class="content">
                                        <a data-v-5e0c66e7="" href="https://www.aorus.com/en-my/graphics-cards/GV-N4090AORUSX-W-24GD-rev-11" title="${object.product.name}">
                                            <h4 data-v-5e0c66e7="" style="padding-top:10px;font-size:24px" class="title fontAorus">${name}</h4>
                                            <div data-v-5e0c66e7="" class="title fontAorus">RM <strong>${(object.product.price * ((100 - object.product.discount) / 100)).toFixed(2)}</strong></div>
                                            <div data-v-5e0c66e7="" style="font-size:16px" class="subtitle fontAorus">
                                                <del>RM${object.product.price.toFixed(2)}</del>
                                                <span style="color:red" class="fontContent"><strong>- ${object.product.discount} %</strong></span>
                                            </div>
                                        </a>
                                    </div>
                                    <!---->
                                 <a data-v-5e0c66e7="" href="https://www.aorus.com/en-my/graphics-cards/GV-N4090AORUSX-W-24GD-rev-11">
                            <div data-v-5e0c66e7=""style="margin-left:28%" class="learn-more-div">Learn More</div>
                    </a>
                            
                           <!---->
           <!---->
                       </div>
                  </div>`)
        } else {
            $("#Product-Container").append(`
                               <div data-v-5e0c66e7="" style="max-width:25%"class="col-product">
                                <div data-v-5e0c66e7="" class="product-box">
                                    <div data-v-5e0c66e7="" class="tag" style="display: none;">NEW</div>
                                    <div data-v-5e0c66e7="" class="img">
                                        <a data-v-5e0c66e7="" href="https://www.aorus.com/en-my/graphics-cards/GV-N4090AORUSX-W-24GD-rev-11" title="${object.product.name}">
                                            <img data-v-5e0c66e7="" alt="${object.product.name}"
                                             src="${object.images.imageUrl}" lazy="loaded" height="343" width="321">
                                        </a>
                                    </div>
                                    <div data-v-5e0c66e7="" class="content">
                                        <a data-v-5e0c66e7="" href="https://www.aorus.com/en-my/graphics-cards/GV-N4090AORUSX-W-24GD-rev-11" title="${object.product.name}">
                                            <h4 data-v-5e0c66e7="" style="padding-top:10px;font-size:24px" class="title fontAorus">${name}</h4>
                                            <div data-v-5e0c66e7="" class="title fontAorus">RM <strong>${(object.product.price * ((100 - object.product.discount) / 100)).toFixed(2)}</strong></div>
                                            <div data-v-5e0c66e7="" style="font-size:16px" class="subtitle fontAorus">
                                                <del>RM${object.product.price.toFixed(2)}</del>
                                                <span style="color:red" class="fontContent"><strong>- ${object.product.discount} %</strong></span>
                                            </div>
                                        </a>
                                    </div>
                                    <!---->
                                    <a data-v-5e0c66e7="" href="https://www.aorus.com/en-my/graphics-cards/GV-N4090AORUSX-W-24GD-rev-11">
                                        <div data-v-5e0c66e7="" class="learn-more-div">Learn More</div>
                                    </a><div data-v-5e0c66e7="" class="comparison-div">
                                        <span data-v-5e0c66e7="">
                                             <div data-v-5e0c66e7=""class="AddToCartBtn"data-productId="${object.product.productId}" style="cursor: pointer;">
                                     <span data-v-5e0c66e7="" class="comparison-checkbox">
                                                </span>
                                                Add To Cart
                                                <div data-v-5e0c66e7="" class="modelNum" style="display: none;"> 0 </div>
                                            </div><div data-v-5e0c66e7="" class="product-model-list p-3 text-left"></div>
                                        </span>
                                    </div>


                                    <!---->
                                    <!---->
                                </div>
                            </div>
                 `)
        }

    }

    //Click Previous Button
    $(".pageBtn.previous").click(function () {
        SearchValue = getSearchValue()

        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        var current = $(".pageValue.active");
        current.removeClass("active").prev().addClass("active")
        checkPageplace(current.prev())

        getProductList(SearchValue, current.prev().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())


    })
    //Click Next Button
    $(".pageBtn.next").click(function () {
        SearchValue = getSearchValue()

        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        var current = $(".pageValue.active");
        current.removeClass("active").next().addClass("active")
        checkPageplace(current.next())

        getProductList(SearchValue, current.next().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())

    })
    $(".pageBtn.first").click(function () {
        SearchValue = getSearchValue()

        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        $(".pageValue.active").removeClass("active")
        $(".pageBtn.previous").next().addClass("active")
        checkPageplace($(".pageBtn.previous").next(),)

        getProductList(SearchValue, $(".pageBtn.previous").next().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())

    })
    //Click Last Button
    $(".pageBtn.last").click(function () {
        SearchValue = getSearchValue()
        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        $(".pageValue.active").removeClass("active")
        $(".pageBtn.next").prev().addClass("active")
        checkPageplace($(".pageBtn.next").prev())

        getProductList(SearchValue, $(".pageBtn.next").prev().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())
    })
    //History Click
    $(".history-div .list").click(function () {
        var searchValue = $(this).text()
        PageBtnGenerate(searchValue, sort)
    })

    PageBtnGenerate(SearchValue, sort)


})