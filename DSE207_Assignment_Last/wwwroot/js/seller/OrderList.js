
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
    table = document.getElementById("MyTable");     //Start sorting
    switching = true;     //Set the sorting direction to ascending:
    dir = "asc";     //Make a loop that will continue until no switching has been done:
    while (switching) {         // Let the loop wont sort again
        switching = false;         // Declare the rows
        rows = table.rows;         // Loop all the rows the table have
        for (i = 1; i < (rows.length - 1); i++) {             // start by saying should be no switching any.
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

$(function () {
    var options = [];
    var stuOptions = [];

    $('.dropdown-menu.statuslist a').on('click', function (event) {

        var $target = $(event.currentTarget),
            val = $target.attr('data-value'),
            $inp = $target.find('input'),
            idx;
        console.log(val)

        if (($inp.prop('checked') == false)) {

            stuOptions.push(val)
            $inp.prop('checked', true)


            $.each(stuOptions, function (count, data) {
                if (data == "all") {
                    stuOptions.splice(count, 1)
                    $(".statuslist li a[data-value='all']").children("input").prop('checked', false)
                }
            })

        }
        else {

            $.each(stuOptions, function (count, data) {
                if (data == val) {
                    stuOptions.splice(count, 1)
                }
            })

            $inp.prop('checked', false)
        }
        if (val == "all" || stuOptions.length == 0) {
            stuOptions = ["all"];

            $(".statuslist li a[data-value='all']").children("input").prop('checked', true)
            $(".statuslist li a:not([data-value='all'])").children("input").prop('checked', false)
            $(`#MyTable tr td.status`).parent().show();
            $(event.target).blur();

            return false;
        }
        $(event.target).blur();

        $(`#MyTable tr td.status`).parent().hide(0, function () {
            $.each(stuOptions, function (count, data) {

                $(`#MyTable tr td.status[data-status='${data}']`).parent().show()

            })
        })

        return false;
    });
    sortbutton()
    function sortbutton() {

        $("th.product-cell").click(function () {


            if ($(this).find(".sortBtn").hasClass("fa-sort")) {
                $(".sortBtn").removeClass("fa-sort-up fa-sort-down ").addClass("fa-sort").css("color", "black");
                $(this).find(".sortBtn").addClass("fa-sort-up ").removeClass("fa-sort").css("color", "green")

            }
            else if ($(this).find(".sortBtn").hasClass("fa-sort-up")) {
                $(".sortBtn").removeClass("fa-sort-up fa-sort-down").addClass("fa-sort").css("color", "black");
                $(this).find(".sortBtn").addClass("fa-sort-down ").removeClass("fa-sort fa-sort-up").css("color", "red")

            }
            else if ($(this).find(".sortBtn").hasClass("fa-sort-down")) {
                $(".sortBtn").removeClass("fa-sort-down fa-sort-up").addClass("fa-sort").css("color", "black");
                $(this).find(".sortBtn").addClass("fa-sort-up").removeClass("fa-sort-down fa-sort").css("color", "green")

            }




        })

    }


    $("#filterInput").keyup(function () {
        $(".statuslist li a[data-value='all']").children("input").prop('checked', true)
        $(".statuslist li a:not([data-value='all'])").children("input").prop('checked', false)
        $("li a[data-value='all']").children("input").prop('checked', true)
        $("li a:not([data-value='all'])").children("input").prop('checked', false)

        var value = $(this).val().toLowerCase()
        var filter = $("#filterValue").val()


        switch (filter) {

            case "name":
                $("#MyTable tr td.name").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "phone": 
                $("#MyTable tr td.phone").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;

        }



    })

    $.ajax({
        type: "GET",
        url: "/sellerFunction/ListingOrders",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                $("#MyTable tbody").append(`
                     <tr class="products-row orders-row" style="display:none;padding-right:5px">

                      <td class="product-cell orderId">
                      </td>
                      <td class="product-cell name">

                      </td>
                 
                      <td class="product-cell phone">
                
                      </td>
       <td class="product-cell createdDate">
                   
                           </td>
                   
                      <td class="product-cell status">
                    </td>
                       
                      </tr> `)

            }
            $.each(data, function (count, item) {

                addOrders(item, count)
            })
            $(".cancelBtn").click(function () {
                var orderId = $(this).attr("data-orderId");
                var btn = $(this).prev().prev();
                $.post("/sellerManageFunction/ChangeOrderStatusToCancel", { OrderId: orderId }, function () {

                    btn.removeClass("btn-outline-primary shipBtn btn-outline-success").addClass("btn-outline-secondary")
                        .text("Cancelled").parents("td").attr("data-status", "cancelled")


                })

            })
            $(".shipBtn").click(function () {
                var btn = $(this);
                var orderId = $(this).val();
                $.post("/sellerManageFunction/ChangeOrderStatusToSuccess", { OrderId: orderId }, function () {

                    btn.removeClass("btn-outline-primary shipBtn").addClass("btn-outline-success")
                        .text("Complete").parents("td").attr("data-status", "complete")
                    btn.next().next().remove();
                })

            })
        }
    })


    function addOrders(object, row) {


        var name = object.customers.nickname;
        name = name.length > 15 ? name.substring(0, 15) + "..." : name
        row = row + 2
        var time = new Date(object.modifiedDate).toLocaleTimeString()
        var date = new Date(object.modifiedDate).toLocaleDateString();

        var status = {
            "PaymentSuccess": "To Ship",
            "Pending": "To Paid",
            "Shipping": "Complete",
            "Cancelled": "cancelled"

        }
        var btnColor = {
            "PaymentSuccess": "primary",
            "Pending": "warning",
            "Shipping": "success",
            "Cancelled": "secondary"
        }
        var shipBtn = object.status == "PaymentSuccess" ? "shipBtn" : "";

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.orderId`).html(`
                            ${object.id}`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.name`).html(`
        <img width="50" height="50" src="${ object.customers.imageUrl}"/>
                           ${name}   </a>`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.phone`).html(`
      ${object.customers.phoneNumber}`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.status`).attr("data-status", status[object.status].toLowerCase())
            .html(` 
 <div style="display:flex;justify-content:space-between;width:100%">

                      <button value="${object.orderId}" style="height:30px;padding:0px 10px;" class="${shipBtn} btn btn-outline-${btnColor[object.status]} ">${status[object.status]}</button>
            <i class='fas fa-edit' style='margin-left:5px;font-size:24px;color:blue;cursor:pointer'></i>
     </div>          `)

        if (object.status != "Shipping" && object.status != "Cancelled") {
            $(`#MyTable tbody .orders-row:nth-child(${row}) td.status div`).append(` 
 <i class='fas fa-times cancelBtn'data-orderId="${object.orderId}" style='margin-left:5px;font-size:24px;color:red;cursor:pointer'></i>
                 `)
        }
        $(`#MyTable tbody .orders-row:nth-child(${row}) td.createdDate`).html(`
      
                           ${date} <br/> ${time}  </a>`)
        $(`#MyTable tbody .orders-row:nth-child(${row})`).fadeIn(200)

    }
    //Append Button Of Page and effect javascript




})


