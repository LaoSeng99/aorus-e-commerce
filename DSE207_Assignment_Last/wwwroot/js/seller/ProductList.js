$(document).ready(function () {

    $("#AddNewP").click(function () {
        location.href = "/Seller_Manage/Products_List/Create_New_Product"
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

    $('.dropdown-menu.catelist a').on('click', function (event) {

        var $target = $(event.currentTarget),
            val = $target.attr('data-value'),
            $inp = $target.find('input'),
            idx;


        if (($inp.prop('checked') == false)) {

            options.push(val)
            $inp.prop('checked', true)

            $.each(options, function (count, data) {
                if (data == "all") {
                    options.splice(count, 1)
                    $("li a[data-value='all']").children("input").prop('checked', false)
                }
            })

        }
        else {

            $.each(options, function (count, data) {
                if (data == val) {
                    options.splice(count, 1)
                }
            })

            $inp.prop('checked', false)
        }
        if (val == "all" || options.length == 0) {
            options = ["all"];

            $("li a[data-value='all']").children("input").prop('checked', true)
            $("li a:not([data-value='all'])").children("input").prop('checked', false)
            $(`#MyTable tr td.category`).parent().show();
            $(event.target).blur();

            return false;
        }
        $(event.target).blur();

        $(`#MyTable tr td.category`).parent().hide(0, function () {
            $.each(options, function (count, data) {

                $(`#MyTable tr td.category[data-category='${data}']`).parent().show()

            })
        })


        return false;
    });
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

    $("#filterInput").keyup(function () {
        $(".statuslist li a[data-value='all']").children("input").prop('checked', true)
        $(".statuslist li a:not([data-value='all'])").children("input").prop('checked', false)
        $("li a[data-value='all']").children("input").prop('checked', true)
        $("li a:not([data-value='all'])").children("input").prop('checked', false)

        var value = $(this).val().toLowerCase()
        var filter = $("#filterValue").val()


        switch (filter) {
            case "name": $("#MyTable tr td.name").filter(function () {
                $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
                break;

        }



    })

    $.ajax({
        type: "GET",
        url: "/sellerFunction/ListingProduct",
        success: function (data) {

            for (var i = 0; i < data.length; i++) {
                $("#MyTable tbody").append(`
                     <tr class="products-row" style="display:none;padding-right:5px">

                      <td class="  sbox" >
                    </td>
                      <td class="product-cell image name">
                      </td>
                      <td class="product-cell category">

                      </td>
                 
                      <td class="product-cell sales">
                
                      </td>
                      <td class="product-cell stock">
                   
                      </td>
                      <td class="product-cell price">
          
                      </td>
                      <td class="product-cell time">
             
                      </td>
                      <td class="product-cell status-cell status">

                      </td>

                   
                      </tr> `)

            }




            $.each(data, function (count, item) {

                addProduct(item, count)
            })
            $(".fa-check-circle").click(function () {
                var btn = $(this);
                $.post("/sellerManageFunction/changeStatus", { productId: $(this).attr("data-productId") }, function (data) {
                    if (data == true) {
                        btn.parents("td").attr("data-status", "active")
                        btn.prev().removeClass("disabled").addClass("active").text("ACTIVE");
                        btn.css("color", "green")


                    } else {
                        btn.parents("td").attr("data-status", "disabled")
                        btn.prev().removeClass("active").addClass("disabled").text("DISABLED");
                        btn.css("color", "gray")
                    }
                    var d = new Date();
                    var time = new Date(d).toLocaleTimeString()
                    var date = new Date(d).toLocaleDateString();
                    btn.parents("tr").find(".time").html(date + "<br>" + time)
                })

            })

            $(".fa-trash-alt").click(function () {

                $(".DeleteButton").attr("data-productId", $(this).attr("data-productId"))
                $(".custom-model-main").addClass('model-open');
                $("#deleteProductName").text($(this).attr("data-productName"))
                $(".closeSuccess-btn, .bg-overlay,.CancelBtn").click(function () {
                    $(".custom-model-main").removeClass('model-open');

                })
            })
            $(".DeleteButton").click(function () {
                var productID = $(this).attr("data-productId")

                $(".custom-model-main").removeClass('model-open');
                $(".pop-up-content-wrap").html("Remove Success!")
                $.post("/sellerManageFunction/RemoveProduct", { productId: productID }, function () {

                    $(".custom-model-main").addClass('model-open');

                    $(".closeSuccess-btn, .bg-overlay").click(function () {
                        $(".custom-model-main").removeClass('model-open');
                        $(`.fa-trash-alt[data-productId='${productID}']`).parents("tr").fadeOut(500, function () {
                            $(this).remove();
                        })
                    })
                })
            })


            //Multi Select Setup
            // 1. give first th a input(checkbox) id = SelectAll
            // 2. give all the product row a input(checkbox) at first, class = selectBox,
            //    and give the productId as value to input(checkbox)
            // 3. open three button for Active, Disabled, Delete function

            //Target All Select Box

            $(".selectBox").click(function () {
                //Active Multi Select
                //Counting
                var selectedCount = $(".selectBox:checked")
                if (selectedCount.length == 0) {
                    $("#SelectAll").prop("checked", false)
                    //If Dont Have, hidden the button
                    $(".multiBtnContainer").fadeOut(300)
                }
                else if (selectedCount.length == $(".selectBox").length) {
                    $(".multiBtnContainer").fadeIn(300)
                    //If All has checked
                    $("#SelectAll").prop("checked", true)
                }
                else {
                    //If have any checked, show the button
                    $(".multiBtnContainer").fadeIn(300)
                }
            })
            $("#SelectAll").click(function () {
                //Get SelectAll 'checked' value
                var value = $(this).prop("checked");
                if (value == false) {
                    $(".multiBtnContainer").fadeOut(300)
                } else {
                    $(".multiBtnContainer").fadeIn(300)
                }
                //Set To Every selectBox
                $.each($(".selectBox"), function () {
                    $(this).prop("checked", value)
                })
            })

        }
    })

    $("#activeSelectedProduct").click(function () {
        //Open an array to store ProductId has selected
        var ProductIdArray = [];

        //Foreach every selectBox has checked
        $.each($(".selectBox:checked"), function () {
            //Push into array
            ProductIdArray.push($(this).val())
            // CSS
            var ProductRow = $(this).parents("tr")
            ProductRow.find("td.status").attr("data-status='active'");
            ProductRow.find("td.status").find("span.status").removeClass("disabled").addClass("active").text("ACTIVE")
            ProductRow.find("td.status").find(".fa-check-circle").css("color", "green")
            //End

        })
        //Calling AJAX to effect the change, Pass the Array ProductId
        //Controller --
        //  Foreach(var product in ProductIdArray){
        //        db.ProductTable.FirstOrDefault(e=>e.ProductId==product)!.Active =true;
        //        }
        // db.saveChange();
        // return Json("");

        $.post("/sellerManageFunction/MultiActiveProduct", { ProductIdArray: ProductIdArray });
    })

    $("#disabledSelectedProduct").click(function () {
        //Open an array to store ProductId has selected
        var ProductIdArray = [];

        //Foreach every selectBox has checked

        $.each($(".selectBox:checked"), function () {
            //Push into array
            ProductIdArray.push($(this).val())
            // CSS
            var ProductRow = $(this).parents("tr")
            ProductRow.find("td.status").attr("data-status='disabled'");
            ProductRow.find("td.status").find("span.status").removeClass("active").addClass("disabled").text("DISABLED")
            ProductRow.find("td.status").find(".fa-check-circle").css("color", "gray")

        })
        //Calling AJAX to effect the change, Pass the Array ProductId
        //Controller --
        //  Foreach(var product in ProductIdArray){
        //        db.ProductTable.FirstOrDefault(e=>e.ProductId==product)!.Active =false;
        //        }
        // db.saveChange();
        // return Json("");
        $.post("/sellerManageFunction/MultiDisabledProduct", { ProductIdArray: ProductIdArray });
    })

    $("#deleteSelectedProduct").click(function () {
        var ProductIdArray = [];

        $.each($(".selectBox:checked"), function () {
            ProductIdArray.push($(this).val())
            var ProductRow = $(this).parents("tr")

            ProductRow.fadeOut(300, function () {
                $(this).remove();
            })
        })
        $.post("/sellerManageFunction/MultiDeleteProduct", { ProductIdArray: ProductIdArray });
    })
    function addProduct(object, row) {

        var name = object.product.name;
        var status = object.product.isAvailable == true ? "active" : "disabled";
        var color = object.product.isAvailable == true ? "green" : "gray"
        name = name.length > 15 ? name.substring(0, 15) + "..." : name
        var time = new Date(object.product.modified_at).toLocaleTimeString()
        var date = new Date(object.product.modified_at).toLocaleDateString();
        row = row + 2

        $(`#MyTable tbody .products-row:nth-child(${row}) td.sbox`).html(`
        <input style="width:20px;height:20px" type="checkbox"class="selectBox" value='${object.product.productId}'  >
                            
                            </a>`)

        $(`#MyTable tbody .products-row:nth-child(${row}) td.name`).html(`
<a style="color:inherit" href="/Seller_Manage/Edit_Product?productid=${object.product.productId}">
                        <img src="${object.images.imageUrl}" />
                    
                           ${name}   </a>`)
        $(`#MyTable tbody .products-row:nth-child(${row}) td.category`)
            .attr("data-category", object.product.categories.categoryName.toLowerCase().replaceAll(" ", ""))
            .html(` 
                    ${object.product.categories.categoryName}
                          `)
        $(`#MyTable tbody .products-row:nth-child(${row}) td.status`)
            .attr("data-status", status.toLowerCase())

            .html(` 
 <div style="display:flex;justify-content:space-between;width:100%">

                      <span class="status ${status}">${status.toLocaleUpperCase()}</span>
<i class="fa fa-check-circle" data-productId = ${object.product.productId}
style="margin-left:10px;font-size:24px ;color:${color}
!important;cursor:pointer;"></i>

<a style=""href="/Seller_Manage/Edit_Product?productid=${object.product.productId}">
<i class='fas fa-edit' style='margin-left:5px;font-size:24px;color:blue'></i>
</a>

<i class='fas fa-trash-alt'
data-productId='${object.product.productId}'
data-productName='${object.product.name}'

style='font-size:24px;color:red;margin-left:10px;cursor:pointer'></i>
             </div>          `)
        $(`#MyTable tbody .products-row:nth-child(${row}) td.sales`).html(` 
            
                       ${object.product.sales}
                        `)
        $(`#MyTable tbody .products-row:nth-child(${row}) td.stock`).html(` 
              
                       ${object.product.stock}
                       `)
        $(`#MyTable tbody .products-row:nth-child(${row}) td.price`).html(` 
             
                        RM ${object.product.price.toFixed(2)}
                       `)

        $(`#MyTable tbody .products-row:nth-child(${row}) td.time`).html(` 
    
                         ${date}<br>${time}
                       `)
        $(`#MyTable tbody .products-row:nth-child(${row})`).fadeIn(200)

    }
    //Append Button Of Page and effect javascript

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



})


