$(function () {
    var Filter = $("#filter-div");
    var ProductDiv = $("#productListDiv");

    //PageScrollCss
    $(window).on('scroll', function () {

        if ($(window).scrollTop() > 628 && $(window).width() > 991) {

            Filter.addClass("active");
            ProductDiv.addClass("fixedFilterDivOver").css("height", "60px")
        } else {

            Filter.removeClass("active");
            ProductDiv.removeClass("fixedFilterDivOver").css("height", "0px")
        }

    });
    //PageOnLoadAnimate
    $(window).on('load', function () {
        setTimeout(function () {
            $("#loading-div").removeClass("active").removeClass("show");

        }, 200);
    })
    setTimeout(function () {
        $("#loading-div").removeClass("active").removeClass("show");

    }, 600);
    //BackToTop
    var btn = $('#backToTop');
    $(window).on('scroll', function () {

        if ($(window).scrollTop() > 150) {
            btn.addClass('show');
        } else {

            btn.removeClass('show');
        }
    });
    btn.on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: 0
        }, '300');
    });
    //Nav bar show product
  
    $(".Product-Menu").hover(function () {
     
        $("#product-submenu").addClass("active");

    }, function () {
        $("#product-submenu").removeClass("active");
    });

    //Menu Button 
    $("#menuBtn").click(function () {
        $(".menuInit").addClass("active")
        $(".menuSearch").addClass("active")
        $(".SideCart").removeClass("active")
    })
    $("#closeSideBar").click(function () {
        $(".menuInit").removeClass("active")
        $(".menuSearch").removeClass("active")
        resetSearchInput()
    })

    //Menu lv1 function
    $(".lv1 li a").click(function () {

        if ($(this).parents("li").hasClass("open")) {
            $(".lv2").slideUp(200)
            $(".lv1 li").removeClass("open")
        } else {
            $(".lv2").slideUp(200)
            $(".lv1 li").removeClass("open")
            $(this).parents("li").addClass("open")
            $(this).next().slideDown(200)
            $(this).next().mouseleave(function () {

                $(this).parents("li").removeClass("open")
                $(this).slideUp(200)
            })
        }
    })

})