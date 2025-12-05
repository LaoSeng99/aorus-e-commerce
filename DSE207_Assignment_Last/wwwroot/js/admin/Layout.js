$(function () {

    var placeNow = document.URL.split("/")


    for (var i = 3; i < placeNow.length; i++) {

        i == placeNow.length - 1 ? $(".breadcrumb").append(` <li class="breadcrumb-item active">${placeNow[4].split("?")[0].replaceAll('_', " ")}</li>`)
            : $(".breadcrumb").append(` <li class="breadcrumb-item">${placeNow[i].replaceAll('_', " ")}</li>`)

    }

    placeNow = placeNow[3]
    $("#pageTitle").html(placeNow.replaceAll("_", " "))
    console.log(placeNow.toLocaleLowerCase().replaceAll(" ", ""))

    switch (placeNow.toLocaleLowerCase().replaceAll(" ","")) {
        case "admin": $(".dashboardlink").addClass("active");
            break;
        case "manage_user": $(".ManageLink").addClass("active").next().show();
            $(".ManageLink").parent().addClass("menu-is-opening menu-open")
            console.log(document.URL.split("/")[4])
            if (document.URL.split("/")[4] == "Customer")
                $(".cusLink").addClass("active")
            else if (document.URL.split("/")[4] == "Seller") {
                $(".selLink").addClass("active")
            }
            break;

    }
    $(".ManageLink").click(function () {
        $(".nav-link").removeClass("active")
        $(this).addClass("active")
    })


    $.get("/AdminFunction/CheckLogin", function (data) {
        if (data == false) {
            location.href = "/Admin/Login"
        } 
    })

})