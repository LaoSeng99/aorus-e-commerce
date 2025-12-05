$(function () {
    //Mobile Responsive Search Div
    $(window).resize(function () {

        if ($(this).width() < 1191) {
            $("#TopSearch").removeClass("active")
            $(".flex-container").css("display", "")

        } else {
            $(".menuInit").removeClass("active")
            $(".menuSearch").removeClass("active")
            resetSearchInput()
        }
    })
    if ($(window).width() < 1199) {
        $(".search-div").removeClass("searchDivType-pc")
            .addClass("searchDivType-mb")
    }
    else {
        $(".search-div").removeClass("searchDivType-mb")
            .addClass("searchDivType-pc")
    }

    //Reser Top Site Input Status
    function resetSearchInput() {
        $(".ClickToSearch").css({

            "cursor": "not-allowed",
            "color": "rgb(102, 102, 102)"

        });
        $(".searchInput").val("").attr("placeholder", "")

    }

    // When Pc site, Click Search Icon show Search Bar
    $(".search-icon_Pc").click(function () {
        $(".flex-container").css("display", "none")
        $(".search-div").slideDown(1000).addClass("active")
        $(".logo").addClass("active")
    })

    //Search Input
    function Search(searchValue) {
        var place = document.URL.toLowerCase()

        if (!place.includes("searchpage")) {
              location.href = `/SearchPage?search=${searchValue}`
        

        }
    }

    //Input Enter
    $(".searchInput").on("keyup change paste", function (event) {
      
        if ($(this).val().length > 2) {

            $(".ClickToSearch").css({
                "cursor": "pointer",
                "color": "white"
            });
        } else {
            $(".ClickToSearch").css({
                "cursor": "not-allowed",
                "color": "rgb(102, 102, 102)"
            });
        }
 
        if (event.keyCode === 13 && $(this).val().length > 2) {
          
            Search($(this).val())
        }
    })

    //Search Button Click
    $('.ClickToSearch').click(function () {
        Search($("#webSearch").val())
    })

    //Close Search Bar Button
    $(".closeSearchBtn").click(function () {
        $(".flex-container").css("display", "")
        $(".search-div").removeClass("active")
        $(".logo").removeClass("active")
        resetSearchInput()

    })

    //Top Search History Bar
    var timer;
    $(".searchInput, .history-div").mouseleave(function () {
        timer = setTimeout(showRecentSearch, 10);
    })
        .mouseenter(function () {
            $(".history-div").css("display", "")
            $(".menu-list").css("display", "none")
            clearTimeout(timer);
        });

    //Recent Search
    function getRecentlySearch() {
        $("#historySearch").html("")
        $.get("/StoreFunction/GetRecenltySearchList", function (data) {
            console.log(data)
            if (data != false) {

                $.each(data, function (count, item) {
                    $("#historySearch").append(`
                        <div data-v-2158a69f="" class="list">${item.recentlySearchName}</div>`)
                })
                $(".history-div .list").click(function () {
                    var searchValue = $(this).text()
                    var place = document.URL.toLowerCase()

                    if (!place.includes("searchpage")) {

                        location.href = `/SearchPage?search=${searchValue}`
                    }
                })
            }
      

        })
    }
    getRecentlySearch()
    function showRecentSearch() {
        $(".history-div").css("display", "none")
        $(".menu-list").css("display", "")
    }
    //History List 

})