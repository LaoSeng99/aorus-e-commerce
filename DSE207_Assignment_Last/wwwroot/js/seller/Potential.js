
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

        console.log(filter)
        switch (filter) {
            case "custname": $("#MyTable tr td.customername").filter(function () {
                $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
                break;
            case "proname": $("#MyTable tr td.name").filter(function () {
                $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
                break;
            case "phone": $("#MyTable tr td.phone").filter(function () {
                $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
                break;
            case "email": $("#MyTable tr td.email").filter(function () {
                $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
                break;

        }



    })

    $.ajax({
        type: "GET",
        url: "/sellerManageFunction/ListPotential",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                $("#MyTable tbody").append(`
                     <tr class="products-row orders-row" style="display:none;padding-right:5px">

                        <td class="product-cell image name">
                      </td>
                      <td class="product-cell customername">

                      </td>
                 
                      <td class="product-cell phone">
                
                      </td>
      <td class="product-cell email">
                
                      </td>
       <td class="product-cell createdDate">
                   
                           </td>
                   
                      <td class="product-cell call">
                    </td>
                       
                      </tr> `)

            }
            $.each(data, function (count, item) {

                addCustomer(item, count)
            })

        }
    })


    function addCustomer(object, row) {

        console.log(object)
        var cusname = object.cartDetails.cart.customers.nickname;
        name = name.length > 15 ? name.substring(0, 15) + "..." : name
        row = row + 2
        var time = new Date(object.cartDetails.create_At).toLocaleTimeString()
        var date = new Date(object.cartDetails.create_At).toLocaleDateString();



        $(`#MyTable tbody .products-row:nth-child(${row}) td.name`).html(`
<a style="color:inherit" href="/Seller_Manage/Edit_Product?productid=${object.product.productId}">
                        <img width="50" height="50" src="${object.images.imageUrl}" />
                    
                           ${object.product.name}   </a>`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.customername`).html(`
          <img width="50" height="50" src="${ object.cartDetails.cart.customers.imageUrl}" />
                           ${cusname}   </a>`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.phone`).html(`
      ${object.cartDetails.cart.customers.phoneNumber}`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.email`).html(`
      ${object.cartDetails.cart.customers.email}`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.call`)
            .html(` 

                      <button style="height:30px;padding:0px 10px;" class=" btn btn-outline-success">Call</button>
           `)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.createdDate`).html(`
      
                           ${date} <br/> ${time}  </a>`)
        $(`#MyTable tbody .orders-row:nth-child(${row})`).fadeIn(200)

    }
    //Append Button Of Page and effect javascript




})


