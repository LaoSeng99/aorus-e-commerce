$(function () {
    //Get Url To Check Value
    var cate = document.URL.toLowerCase().split("category=")[1]
    var sort = document.URL.toLowerCase().split("sortby=")[1];

    if (typeof cate === "undefined") {
        cate = "all"
    }
    else {
        cate = cate.replaceAll("%20", " ")
    }
    if (typeof sort === "undefined") {
        sort = "featured"
    }
    if (cate.includes("&")) {
        cate = cate.replaceAll(`&sortby=${sort}`, "")

    }

    //Checking Place reset ChecKbox
    if (cate != "all") {
        $(".checkBoxSpan,.choose-title").removeClass("active");

        var checkBox = $(`.side-menu-name>span[title='${cate}']`);
        checkBox.prev().addClass("active");

        var checkParent = checkBox.parents("ul");
        checkParent.css("display", "")

        var checkPlusMinus = checkParent.prev();
        checkPlusMinus.addClass("active")
        checkPlusMinus.find(".fa-minus").show()
        checkPlusMinus.find(".fa-plus").hide()

    }
    //Checking Url
 
    function checkUrl(object) {
        var cateUrl = object.next().attr("title")

      $(".filter-select").children(".title").text("Featured").attr("data-value","Featured")
      
        window.history.replaceState(null, null, `?category=${cateUrl}&sortby=featured`);


    }
    function getCateValue() {
        var CateValue = document.URL.toLowerCase().split("category=")[1]
        if (typeof CateValue === "undefined") {
            CateValue = "all"
        }
        else {
            CateValue = CateValue.replaceAll("%20", " ")
        }
        if (CateValue.includes("&")) {
            CateValue = CateValue.replaceAll(`&sortby=${sort}`, "")

        }

    
        return CateValue;
    }

    //Filter,CheckBox Mobile responsive
    $(".filterBtnMobile").click(function () {
        $(".filter-choose-div").addClass("active")
    })
    $(".filterDivCloseBtn").click(function () {
        $(".filter-choose-div").removeClass("active")
    })
    var Filter = $("#filter-div");
    var ProductDiv = $("#productListDiv");
    $(window).on('scroll', function () {

        if ($(window).scrollTop() > 628 && $(window).width() > 991) {

            Filter.addClass("active");
            ProductDiv.addClass("fixedFilterDivOver").css("height", "60px")
        } else {

            Filter.removeClass("active");
            ProductDiv.removeClass("fixedFilterDivOver").css("height", "0px")
        }

    });

    //Filter,CheckBox Css
    function CheckingActive(Object) {
        if (Object.hasClass("active")) {
            Object.removeClass("active");
        } else {
            Object.addClass("active");
        }
    }

    function MinusPlus(Plus, Minus) {
        if (Plus.css("display") == "none") {
            Minus.css("display", "none");
            Plus.css("display", "");
        } else {
            Minus.css("display", "");
            Plus.css("display", "none");
        }
    }
    function DisplayMenu(Choose, c_plus, c_minus) {
        MinusPlus(c_plus, c_minus)
        if (Choose.hasClass("active")) {
            Choose.removeClass("active");
            Choose.next().css("display", "none")
        } else {
            Choose.addClass("active")
            Choose.next().css("display", "")
        }
    }
    $(".checkBoxSpan").click(function () {

        if ($(this).hasClass("active")) {
            return;
        }

        if ($(this).next().attr("title").trim() == "all") {
            $(".allProduct").addClass("active")
        } else {
            $(".allProduct").removeClass("active")
        }
        checkUrl($(this))
        loadingAnimation()

        changeTopBar($(this).next().attr("title"))

        //Filter Checking all product
        $(".checkBoxSpan").removeClass("active")
        $(this).addClass("active");

        $(".filterCount").text("1");
        //Remove all col-product

        PageBtnGenerate($(this).next().text().trim(), "featured")

        //Ajax Complete/done




    })
    $(".choose-title").click(function () {
        if ($(this).hasClass("allProduct")) {
            return;
        }
        var titleName = $(this).children("h3").html()
        var plus = $(this).children(".text-center").children(".fa-plus");
        var minus = $(this).children(".text-center").children(".fa-minus");
        DisplayMenu($(this), plus, minus);

    })
    $(".filter-select").click(function () {
        CheckingActive($(this).children(".list"))

    })

    //Remove All Product
    $(".btn-filter-clear").click(function () {
        $(".filter-item").text("0 Items")
        $(".checkBoxSpan").removeClass("active")
        $(".filterCount").text("0");
        //Filter Checking all product
        //Remove all col-product

        $(".col-product").remove();
        $(".pageValue").remove();
        $(".pageBtn").attr("disabled", true)

        //Ajax Complete/done


    })

    //Filter/Sort Orderby

    $(".filter-select .list > div").click(function () {
        $("#Product-Container").children().fadeOut(200, function () {
            $(this).remove()
        });
        $(".productAnime").css("display", "")

        var filterCate = document.URL.toLowerCase().split("category=")[1]
        var filterSort = document.URL.toLowerCase().split("sortby=")[1];
        if (typeof filterCate === "undefined") {
            filterCate = "all"
        } else {
            filterCate = filterCate.replaceAll("%20", " ")
        }
        if (typeof filterSort === "undefined") {
            filterSort = "featured"
        }
        if (filterCate.includes("&")) {
            filterCate = filterCate.replaceAll(`&sortby=${filterSort}`, "")

        }

        getProductList(filterCate, $(".pageValue.active").val(), $(this).attr("data-value").toLowerCase())
        $(".filter-select").children(".title").text($(this).text()).attr("data-value", $(this).attr("data-value"))

    })

    //Loading Animation
    function loadingAnimation() {
        $("#loading-div").addClass("active show")
        setTimeout(function () {
            $("#loading-div").removeClass("active").removeClass("show");

        }, 800);
    }

    //Changing Top Picture based on category
    function changeTopBar(title) {

        function getImage(round, string) {
            switch (round) {
                case 0: return titleImage1[string];
                case 1: return titleImage2[string];
                case 2: return titleImage3[string];
            }
        }
        function geth2(round, string) {
            switch (round) {
                case 0: return titleH21[string];
                case 1: return titleH22[string];
                case 2: return titleH23[string];
            }
        }
        var titleImage1 = {
            "motherboards": "/Image/StoreOriImage/motherboards-aorus-gaming.73cc1249.png.webp",
            "graphic card": "/Image/StoreOriImage/graphics-cards-aorus.e3d24c95.png.webp",
            "monitors": "/Image/StoreOriImage/monitors-aorus.d6092702.png.webp",
            "laptops": "/Image/StoreOriImage/laptops-aorus.44ca50b7.png.webp",
            "pc components": "/Image/StoreOriImage/components-ssd.9c1e328c.png.webp",
            "pc peripherals": "/Image/StoreOriImage/peripherals-keyboard.8bfdc0fc.png.webp",
            "all": "/Image/StoreOriImage/F_20221110182331zJ9FgE.jpg",
            "clothes": "/Image/StoreOriImage/clothes-01.jpg",
            "watchs": "/Image/StoreOriImage/watchs-01.webp",
            "food": "/Image/StoreOriImage/food-01.jpg",
            "shoes": "/Image/StoreOriImage/shoes-01.jpg",

        }
        var titleImage2 = {
            "motherboards": "/Image/StoreOriImage/motherboards-gigabyte-gaming.5932f82a.png.webp",
            "graphic card": "/Image/StoreOriImage/graphics-cards-nvidia.e26d2df8.png.webp",
            "monitors": "/Image/StoreOriImage/4KBIG.jpg",
            "laptops": "/Image/StoreOriImage/laptops-aero.059cb37c.png.webp",
            "pc components": "/Image/StoreOriImage/components-pc-case.a02cd7ce.png.webp",
            "pc peripherals": "/Image/StoreOriImage/peripherals-mouse.af5ba0eb.png.webp",
            "clothes": "/Image/StoreOriImage/clothes-02.jpg",
            "watchs": "/Image/StoreOriImage/watchs-02.jpg",
            "food": "/Image/StoreOriImage/food-02.jpeg",
            "shoes": "/Image/StoreOriImage/shoes-02.jpg",

            "all": "/Image/StoreOriImage/all_01.jpg"
        }
        var titleImage3 = {
            "motherboards": "/Image/StoreOriImage/motherboards-ultra-durable.5237a792.png.webp",
            "graphic card": "/Image/StoreOriImage/graphics-cards-amd.a67ba11b.png.webp",
            "monitors": "/Image/StoreOriImage/monitors-gigabyte.24e2c42b.png.webp",
            "laptops": "/Image/StoreOriImage/laptops-g.db949305.png.webp",
            "pc components": "/Image/StoreOriImage/components-cpu-cooler.cdd9755b.png.webp",
            "pc peripherals": "/Image/StoreOriImage/peripherals-gaming-chair.0517fb6d.png.webp",
            "all": "/Image/StoreOriImage/F_20230119105779vy2QGE.jpg",
            "clothes": "/Image/StoreOriImage/clothes-03.webp",
            "watchs": "/Image/StoreOriImage/watchs-03.webp",
            "food": "/Image/StoreOriImage/food-03.jpeg",
            "shoes": "/Image/StoreOriImage/shoes-03.jpg",

        }
        var titleH21 = {
            "motherboards": "AORUS GAMING",
            "graphic card": "AORUS",
            "monitors": "AORUS",
            "laptops": "AORUS",
            "pc components": "SOLID STATE DRIVER(SSD)",
            "pc peripherals": "KEYBOARD",
            "all": "",
        }
        var titleH22 = {
            "motherboards": "GIGABYTE GAMING",
            "graphic card": "NVIDIA SERIES",
            "monitors": "",
            "laptops": "AERO",
            "pc components": "PC CASE",
            "pc peripherals": "GAMING CHAIR",
            "all": "",
        }
        var titleH23 = {
            "motherboards": "ULTRA DURABLE",
            "graphic card": "AMD SERIES",
            "monitors": "GIGABYTE",
            "laptops": "GIGABYTE GAMING",
            "pc components": "CPU COOLER",
            "pc peripherals": "MOUSE",
            "all": "",
        }
        title = title.replaceAll("%20", " ")
        $("#productSeriesDiv").find("h1").text(title)

        for (var i = 0; i < 3; i++) {
            $("#productSeriesDiv").find("img").eq(i).attr("src", getImage(i, title))
            $("#productSeriesDiv").find("h2").eq(i).text(geth2(i, title))
        }


    }

    //Generate Page based on Ajax Call
    function checkPageplace(object) {

        if ($(".pageBtn").length <= 5) {
            $(".pageBtn.first, .pageBtn.previous,.pageBtn.next, .pageBtn.last").attr("disabled", true)
            return;
        }

        if (object.val() == 1) {
            console.log(object.val())
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
  
    //Click Previous Button
    $(".pageBtn.previous").click(function () {
        cate = getCateValue()
        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        var current = $(".pageValue.active");
        current.removeClass("active").prev().addClass("active")
        checkPageplace(current.prev())

        getProductList(cate, current.prev().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())


    })
    //Click Next Button
    $(".pageBtn.next").click(function () {
        cate = getCateValue()
        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        var current = $(".pageValue.active");
        current.removeClass("active").next().addClass("active")
        checkPageplace(current.next())

        getProductList(cate, current.next().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())

    })
    //Click First Button
    $(".pageBtn.first").click(function () {
        cate = getCateValue()
        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        $(".pageValue.active").removeClass("active")
        $(".pageBtn.previous").next().addClass("active")
        checkPageplace($(".pageBtn.previous").next(),)

        getProductList(cate, $(".pageBtn.previous").next().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())

    })
    //Click Last Button
    $(".pageBtn.last").click(function () {
        cate = getCateValue()
        $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);
        $(".pageValue.active").removeClass("active")
        $(".pageBtn.next").prev().addClass("active")
        checkPageplace($(".pageBtn.next").prev())

        getProductList(cate, $(".pageBtn.next").prev().val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())
    })
    function PageBtnGenerate(category, sortby) {
        $(".pageValue").remove();

        $(".productAnime").css("display", "")
        $.post("/StoreFunction/ProductCounting", { Category: category }).done(function (data) {
            //Get Count Page
            var page = Math.ceil(parseInt(data) / 9)
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
            $(".filter-item").text(data + " Items")
            getProductList(category, 1, sortby)
        }, function () {

            checkPageplace($(".pageValue.active"))
            changeTopBar(category)
            //Click Page Button
      
            $(".pageValue").click(function () {


                if ($(this).hasClass("active")) {
                    return;
                }
                $('html, body').animate({ scrollTop: $("#Product-Container").offset().top - 80 }, 150);

                $(".pageValue").removeClass("active");
                $(this).addClass("active")
                checkPageplace($(this))
                getProductList(category, $(this).val(), $(".filter-select").children(".title").attr("data-value").trim().toLowerCase())

            })

        })

    }

    function getProductList(category, currentPage, sort) {

        $(".product-box").parent().remove();
        $(".productAnime").css("display", "")

        $.ajax({
            type: "GET",
            url: "/StoreFunction/GetProductList",
            data: { Category: category, currentPage: currentPage, sortBy: sort },
            success: function (data) {
                $(".productAnime").fadeOut(400, function () {
                    $.each(data, function (count, item) {

                        addProduct(item)
                    })
                    var count = 0;
                    $(".AddToCartBtn").click(function () {
                 
                        if (count == 1) {
                            return;
                        }
                        count++;

                        var btnProductId = $(this).attr("data-productId")

                        var disabledButton = $(this)
              
                        $.get("/CustomerProfilesFunction/CheckLogin", function (data) {
                            if (data == true) {

                                $.post("/StoreFunction/ProductListAddToCart", { ProductId: btnProductId },
                                    function (data) {

                                        if (data == "success") {

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
    <div class="product side_ProductName">
        <!-- Product Image -->
        <img width="150" height="100"src="${item.image.imageUrl}" alt="ipad">
        <div style="padding:8px;width:64%">
            <!-- Product Name -->
            <span class="side_cart_productName" style="font-size:20px">
               <a href="/productdetails?productId=${item.cartDetails.product.productId}" style="color:white"> ${item.cartDetails.product.name}</a>
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
                                                    count = 0;
                                                    disabledButton.attr("disabled", false)
                                                    $(".checkout-button").children().text("Details & Checkout").attr("href", "/CustomerCart/CartList")
                                                    $(".cartShadow").fadeIn(300)
                                                    $(".cart-panel").addClass("open")
                                                    $("#open-panel,.cartCountBg").addClass("hide")
                                                });
                                            })
                                        } else if (data == "reachTheLimit") {
                                            count = 0;
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
                })
           
        
            }
        })
    }
    function addProduct(object) {

        var name = object.product.name;
        name = name.length > 15 ? name.substring(0, 15) + "..." : name
        if (object.product.stock == 0) {
            $("#Product-Container").append(`
                  <div data-v-5e0c66e7="" class="col-product">
                 <div data-v-5e0c66e7="" class="product-box">
                     <div data-v-5e0c66e7="" class="tag" style="display: none;">NEW</div>
                       <div data-v-5e0c66e7="" class="img">
                     <a data-v-5e0c66e7="" href="/productdetails?productId=${object.product.productId}" title="${object.product.name}">
                            <img data-v-5e0c66e7=""alt="${object.product.name}"
                           src="${object.images.imageUrl}" lazy="loaded" height="343" width="321">
                             </a>
      <div class="badge-overlay">
                <!-- Change Badge Position, Color, Text here-->
                <span class="top-left badge orange">Sold Out</span>
            </div>
                          </div>
                      <div data-v-5e0c66e7="" class="content">
                              <a data-v-5e0c66e7="" href="/productdetails?productId=${object.product.productId}" title="${object.product.name}">
                       <h4 data-v-5e0c66e7=""style="padding-top:10px;font-size:24px" class="title fontAorus">${name}</h4>
                               <div data-v-5e0c66e7="" class="title fontAorus">RM <strong>${(object.product.price * ((100 - object.product.discount) / 100)).toFixed(2)}</strong></div>
                         <div data-v-5e0c66e7=""style="font-size:16px" class="subtitle fontAorus"><del>RM${object.product.price.toFixed(2)}</del>
                    <span style="color:red" class="fontContent"><strong>- ${object.product.discount} %</strong></span></div>
                                        </a>
                  </div>
                                <!---->
                   <a data-v-5e0c66e7="" href="/productdetails?productId=${object.product.productId}">
                            <div data-v-5e0c66e7=""style="margin-left:28%" class="learn-more-div">Learn More</div>
                    </a>

                           <!---->
           <!---->
                       </div>
                  </div> `)
        } else {

            $("#Product-Container").append(`
                  <div data-v-5e0c66e7="" class="col-product">
                 <div data-v-5e0c66e7="" class="product-box">
                     <div data-v-5e0c66e7="" class="tag" style="display: none;">NEW</div>
                       <div data-v-5e0c66e7="" class="img">
                     <a data-v-5e0c66e7="" href="/productdetails?productId=${object.product.productId}" title="${object.product.name}">
                            <img data-v-5e0c66e7="" alt="${object.product.name}"
                           src="${object.images.imageUrl}" lazy="loaded" height="343" width="321">
                             </a>
                          </div>
                      <div data-v-5e0c66e7="" class="content">
                              <a data-v-5e0c66e7="" href="/productdetails?productId=${object.product.productId}" title="${object.product.name}">
                       <h4 data-v-5e0c66e7=""style="padding-top:10px;font-size:24px" class="title fontAorus">${name}</h4>
                               <div data-v-5e0c66e7="" class="title fontAorus">RM <strong>${(object.product.price * ((100 - object.product.discount) / 100)).toFixed(2)}</strong></div>
                         <div data-v-5e0c66e7=""style="font-size:16px" class="subtitle fontAorus"><del>RM${object.product.price.toFixed(2)}</del>
                    <span style="color:red" class="fontContent"><strong>- ${object.product.discount} %</strong></span></div>
</a>
                  </div>
                                <!---->
                   <a data-v-5e0c66e7="" href="/productdetails?productId=${object.product.productId}">
                      <div data-v-5e0c66e7="" class="learn-more-div">Learn More</div></a><div data-v-5e0c66e7="" class="comparison-div">
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
                  </div> `)
        }

    }
    PageBtnGenerate(cate, sort)

})