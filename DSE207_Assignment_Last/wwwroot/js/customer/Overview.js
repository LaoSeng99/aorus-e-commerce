$(function () {
    $.ajax({
        type: "GET",
        url: "/CustomerProfilesFunction/GetuserInfo",
        success: function (data) {
            $(".member-img").children().attr("src", data.imageUrl)
            $("#ov_nickname").text(data.nickname)
            $("#ov_email").text(data.email)
            $("#ov_address").html(`${data.addressLine1}<br>
                                    ${data.addressLine2 == null ? data.addressLine2 : "-"}<br>
                                   ${data.city}, ${data.state} <br />
                                    ${data.zipCode},${data.country}`)
            $("#User_Name_avatar").text(data.nickname)

        }
    })
    $.get("/CustomerProfilesFunction/GetRecentlyOrder", function (data) {

        $.each(data, function (count, item) {

            var placeDate = new Date(item.orders.createdDate).toLocaleDateString();
            var grandTotal = item.orders.grandTotal.toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");

            var imgLink = "";
            var imgCount = 0;
            var btn;

            if (item.orders.status == "Pending") {
                btn = ` <a href="/PaymentCheckOutPage?ordersid=${item.orders.orderId}&cartId=${item.orders.cart.cartId}"> <button  class="btn btn-yellow">  Pay Now </button></a>`
            } else if (item.orders.status == "PaymentSuccess") {
                btn = `   <button val="${item.orders.orderId}" class="btn btn-outline-primary"> Shipping</button>`
            } else if (item.orders.status == "Cancel") {
                btn = `   <button val="${item.orders.orderId}" class="btn btn-gray"> Cancelled</button>`

            }
            else {
                btn = `   <button val="${item.orders.orderId}" class="btn btn-outline-success"> Success</button>`
            }

            $.each(item.opList, function (count, product) {
                if (imgCount < 3) {
                    imgCount++;
                    imgLink += `<a href="/productdetails?productId=${product.product.productId}"><img style="margin-right:5px;" width="70"height="70" src="${product.image.imageUrl}"/></a>`


                } else if (imgCount == 3) {
                    imgCount++;
                    imgLink += `<i class="fa fa-plus" style="font-size:20px;padding-left:10px">${item.opList.length - 3} Items</i>`

                }
            })

            $("#RecOrderTable").append(`
                          <tr style="">
                                <td>
                                    <p>Order Id :</p>
                                    <p>Place On : </p>
                                </td>
                                <td>
                                    <p> #${item.orders.id}</p>
                                    <p>${placeDate}</p>
                                </td>
                                <td>
                                  ${imgLink}
                                </td>
                          
                                <td>
                                    ${grandTotal}
                                </td>
                                 <td style="display:flex; justify-content:center;   
                                                          height: 50%;
                                                          position: relative;
                                                          top: 20px;">
                               ${btn}
                                </td>
                            </tr>
                                `)


        })
    })

    $("#lastestBtn").click(function () {
        var text = $(this).text() == "By Latest" ? "By Default" : "By Latest";
        $(this).text(text)

    })
})

function sortTable(n, SortBy) {
    //Parameter setting
    // n      = Table Columns
    // SortBy = Number  for Sort by Number
    // SortBy != Number  for Srot By Alphabet
    //When those onclick funtion is sortTable get Clicking,  Run this function  
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    //table       = which table apply the sorting function
    //rows        = which rows in the table
    //switching   = true= start sorting data, false = sort complete, stop.
    //i           = Control the loop
    //x           = Current Rows
    //y           = Next Rows
    //shouldSwitch= Checking two rows, should be switching position or not
    //dir         = Direction, sort Ascending or Descending
    //switchcount = Control Direction is Asc or Desc     //Setting the table want to sort  as  <table id="MyTable">
    table = document.getElementById("RecOrderTable");     //Start sorting
    switching = true;     //Set the sorting direction to ascending:
    dir = "asc";     //Make a loop that will continue until no switching has been done:
    while (switching) {         // Let the loop wont sort again
        switching = false;         // Declare the rows
        rows = table.rows;         // Loop all the rows the table have
        for (i = 0; i < (rows.length - 1); i++) {
            // start by saying should be no switching any.
            shouldSwitch = false;             // n = Table Columns position
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];             // Sort By Number
            if (SortBy == Number) {                 //If the Text include alphabet, remove all
                let num1 = x.innerHTML.replace(/[^0-9\.]+/g, "");
                let num2 = y.innerHTML.replace(/[^0-9\.]+/g, "");
                // dir start by Ascending
                if (dir == "asc") {
                    if (Number(num1) > Number(num2)) {                         //Declare two rows, should be switching position
                        shouldSwitch = true; break;
                        //Stop The Loop
                    }
                }
                // sort by Descending
                else if (dir == "desc") {
                    if (Number(num1) < Number(num2)) {                         //Declare two rows, should be switching position
                        shouldSwitch = true; break;
                        //Stop The Loop
                    }
                }
            }
            //Sort By Alphabet A-Z
            else {
                // dir start by Ascending
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //Declare two rows, should be switching position
                        shouldSwitch = true; break;
                        //Stop The Loop
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        //Declare two rows, should be switching position
                        shouldSwitch = true; break;
                        //Stop The Loop
                    }
                }
            }
        }
        //For the Two Rows need to switch Position
        if (shouldSwitch) {             //Switching Position
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);             //Complete Switch, set switching to true for continue the loop
            switching = true;             //increase count for check direction
            switchcount++;
        }
        //If Ascending, Two Rows no need to switch position
        else {             // Count =0 meaning sort ascending failed
            if (switchcount == 0 && dir == "asc") {                 //Start Descending
                dir = "desc";                 //Continue Loop
                switching = true;
            }
        }
    }
}
