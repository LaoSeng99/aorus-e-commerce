$(function () {
    // Slider(all Slides in a container)classList
    const slider = document.querySelector(".slider")
    // All trails 
    var AllSliderButton = $(".SliderBtn")


    // Transform value
    let value = 0
    // trail index number
    let trailValue = 0
    // interval (Duration)
    let interval = 5000;


    var tick,
        percentTime;


    var time = 5;
    var bar = $("#PrgressBar");
    //Progress Bar

    startProgressbar()
    ProgressBarInterval()
    function startProgressbar() {
        resetProgressbar();
        percentTime = 0;
        tick = setInterval(ProgressBarInterval, 13);
    }
    function resetProgressbar() {
        bar.css("height", 0 + '%');
        clearTimeout(tick);
    }
    function ProgressBarInterval() {

        if ($(window).width() > 650) {
            $(".progress, .progress .bar").show();
            percentTime += 1.5 / (time + 0.15);
            if (percentTime <= 100) {
                bar.css({
                    height: percentTime + "%"
                });
            }
            if (percentTime >= 120) {

                startProgressbar();
            }
        } else {
            $(".progress, .progress .bar").hide();
        }



    }
    // Start interval for slides
    let start = setInterval(() => slide("increase"), interval)

    // Function to slide forward
    const slide = (condition) => {
        // CLear interval
        clearInterval(start)
        // update value and trailValue
        condition === "increase" ? initiateINC() : initiateDEC()
        // move slide
        move(value, trailValue)
        // Restart Animation
        animate()
        // start interal for slides back 

        start = setInterval(() => slide("increase"), interval);
        startProgressbar();
    }

    // function for increase(forward, next) configuration
    const initiateINC = () => {
        // Remove active from all trails

        AllSliderButton.removeClass("active")
        // increase transform value
        value === 80 ? value = 0 : value += 20
        // update trailValue based on value
        trailUpdate()
    }

    // function for decrease(backward, previous) configuration
    const initiateDEC = () => {
        // Remove active from all trails
        AllSliderButton.removeClass("active")
        // decrease transform value
        value === 0 ? value = 80 : value -= 20
        // update trailValue based on value
        trailUpdate()
    };

    // function to transform slide 
    const move = (S, T) => {
        // transform slider
        slider.style.transform = `translateX(-${S}%)`
        //add active class to the current trail
        AllSliderButton[T].classList.add("active")
    };

    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: "power2.inOut" } });
    tl.from(".bg", { x: "-100%", opacity: 0 })
        .from(".sliderP", { opacity: 0 }, "-=0.3")
        .from("sliderH1", { opacity: 0, y: "30px" }, "-=0.3")
    //.from("button", { opacity: 0, y: "-40px" }, "-=0.8")

    // function to restart animation
    const animate = () => tl.restart();

    // function to update trailValue based on slide value
    const trailUpdate = () => {
        if (value === 0) {
            trailValue = 0
        } else if (value === 20) {
            trailValue = 1
        } else if (value === 40) {
            trailValue = 2
        } else if (value === 60) {
            trailValue = 3
        } else {
            trailValue = 4

        }
    }


    // Next  and  Previous button function (SVG icon with different classes)
    document.querySelectorAll(".sliderClick").forEach(cur => {

        // Assign function based on the class Name("next" and "prev")
        cur.addEventListener("click", () => cur.classList.contains("next") ? slide("increase") : slide("decrease"))
    })

    // function to slide when trail is clicked

    //const clickCheck = (e) => {

    //}

    // Add function to all trails
    $(".SliderBtn").click(function () {
        // CLear interval
        clearInterval(start)
        // remove active class from all trails
        AllSliderButton.removeClass("active")
        // Get selected trail


        // add active class
        $(this).addClass("active")

        // Update slide value based on the selected trail
        if ($(this).val() == 1) {
            value = 0
        } else if ($(this).val() == 2) {
            value = 20
        } else if ($(this).val() == 3) {
            value = 40
        } else if ($(this).val() == 4) {
            value = 60
        } else {
            value = 80
        }
        // update trail based on value
        trailUpdate()
        // transfrom slide
        move(value, trailValue)
        // start animation
        animate()
        // start interval
        start = setInterval(() => slide("increase"), interval)
        startProgressbar();
    })
    //trail.forEach(cur => cur.addEventListener("click", (ev) => clickCheck(ev)))
    // Mobile touch Slide Section
    const touchSlide = (() => {
        let start, move, change, sliderWidth

        // Do this on initial touch on screen
        slider.addEventListener("touchstart", (e) => {
            // get the touche position of X on the screen
            start = e.touches[0].clientX
            // (each slide with) the width of the slider container divided by the number of slides
            sliderWidth = slider.clientWidth / AllSliderButton.length
        })

        // Do this on touchDrag on screen
        slider.addEventListener("touchmove", (e) => {
            // prevent default function
            e.preventDefault()
            // get the touche position of X on the screen when dragging stops
            move = e.touches[0].clientX
            // Subtract initial position from end position and save to change variabla
            change = start - move
        })

        const mobile = (e) => {
            // if change is greater than a quarter of sliderWidth, next else Do NOTHING
            change > (sliderWidth / 4) ? slide("increase") : null;
            // if change * -1 is greater than a quarter of sliderWidth, prev else Do NOTHING
            (change * -1) > (sliderWidth / 4) ? slide("decrease") : null;
            // reset all variable to 0
            [start, move, change, sliderWidth] = [0, 0, 0, 0]
        }
        // call mobile on touch end
        slider.addEventListener("touchend", mobile)
    })()
    //Slider End

    var slickOriWidth = -1736;
    $(".nextBtn-Cate").click(function () {

        slickOriWidth -= 434;

        $(".slick-track-Cate").css({
            transform: `translate3d(${slickOriWidth}px, 0px, 0px)`
        })
        if (slickOriWidth <= -3906) {
            slickOriWidth = -1736;
        }
    })
    $(".prevBtn-Cate").click(function () {

        slickOriWidth += 434;

        $(".slick-track-Cate").css({
            transform: `translate3d(${slickOriWidth}px, 0px, 0px)`
        })
        if (slickOriWidth >= -1736) {
            slickOriWidth = -3906;
        }

    })

    var slickOriWidthTop = -1736;
    $(".nextBtn-Top").click(function () {

        slickOriWidthTop -= 434;

        $(".slick-track-Top").css({
            transform: `translate3d(${slickOriWidthTop}px, 0px, 0px)`
        })
        if (slickOriWidthTop <= -3906) {
            slickOriWidthTop = -1736;
        }
    })
    $(".prevBtn-Top").click(function () {

        slickOriWidthTop += 434;

        $(".slick-track-Top").css({
            transform: `translate3d(${slickOriWidthTop}px, 0px, 0px)`
        })
        if (slickOriWidthTop >= -1736) {
            slickOriWidthTop = -3906;
        }

    })


    $.get("/StoreFunction/GetBestProduct", function (data) {

        $.each(data, function (count, item) {
 
            var name = item.product.name.length > 20 ? item.product.name.substring(0, 20) + "..." :
                item.product.name
            $("#bestSell").append(`
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

})