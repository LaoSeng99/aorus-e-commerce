$(function () {

    var placeNow = document.URL.split("/")


    for (var i = 3; i < placeNow.length; i++) {

        i == placeNow.length - 1 ? $(".breadcrumb").append(` <li class="breadcrumb-item active">${placeNow[4].split("?")[0].replaceAll('_', " ")}</li>`)
            : $(".breadcrumb").append(` <li class="breadcrumb-item">${placeNow[i].replaceAll('_', " ")}</li>`)

    }

    placeNow = placeNow[4].split("?")[0]
    $("#pageTitle").html(placeNow.replaceAll("_", " "))

    switch (placeNow.toLocaleLowerCase()) {
        case "dashboard": $(".dashboardlink").addClass("active");
            break;
        case "products_list": $(".plistlink").addClass("active");
            break;
        case "order": $(".orderlink").addClass("active");
            break;
        case "potential_customers": $(".potenlink").addClass("active");
            break;

    }
    $.get("/sellerManageFunction/CheckLogin", function (data) {
        if (data == false) {
            location.href = "/sellerLogin/Login"
        } else {

            console.log(data.imageUrl)
            $("#sellerImageInfo").attr("src", data.imageUrl);
            $("#userNameInfo").text(data.name);
        }
    })

})