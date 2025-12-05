$(function () {
    $.ajax({
        type: "GET",
        url: "/sellerManageFunction/ListOrdersTake5",
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
                      <td class="product-cell status">
                        </td>
                      <td class="product-cell createdDate">
                   
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
        row = row + 1
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
        var time = new Date(object.createdDate).toLocaleTimeString()
        var date = new Date(object.createdDate).toLocaleDateString();


        $(`#MyTable tbody .orders-row:nth-child(${row}) td.orderId`).html(`
                            ${object.id}`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.name`).html(`
      
                           ${name}   </a>`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.phone`).html(`
      ${object.customers.phoneNumber}`)

        $(`#MyTable tbody .orders-row:nth-child(${row}) td.status`).attr("data-status", status[object.status].toLowerCase())
            .html(` 
 <div style="display:flex;justify-content:space-between;width:100%">

                      <button style="height:30px;padding:0px 10px;" class="btn btn-outline-${btnColor[object.status]} ">${status[object.status]}</button>
    </div>          `)


        $(`#MyTable tbody .orders-row:nth-child(${row}) td.createdDate`).html(`
      
                           ${date} <br/> ${time}  </a>`)

        $(`#MyTable tbody .orders-row:nth-child(${row})`).fadeIn(200)

    }
})

$(function () {

    setTimeout(function () {
        var Checkbox = $(".control-sidebar-dark").find(".os-content").find("div.mb-4 span:contains('Dark Mode')")

        if (localStorage.getItem('mode') == 'dark') {
           Checkbox.prev().prop("checked",true)
        } else {
            Checkbox.prev().prop("checked", false)
        }

        $(".control-sidebar-dark").find(".os-content").find("div.mb-4 input").change(function () {

            if ($("body").hasClass("dark-mode")) {
                $(".control-sidebar-dark").find(".os-content").find("div.mb-4 input:contains('Dark Mode')").prop("checked", true)

                localStorage.setItem("mode", "dark");
                $("body").addClass("dark-mode")



            } else {
                $(".control-sidebar-dark").find(".os-content").find("div.mb-4 input:contains('Dark Mode')").prop("checked", false)

                localStorage.setItem("mode", "light");
                $("body").removeClass("dark-mode")
                $("canvas").css("color", "black")

            }

        })
    }, 1500)
    /* ChartJS
     * -------
     * Here we will create a few charts using ChartJS
     */

    //--------------
    //- AREA CHART -
    //--------------

    // Get context with jQuery - using jQuery's .get() method.


    var color;
    if (localStorage.getItem('mode') == 'dark') {
        color = "white";
    } else {
        color = "black";
    }
    //-------------
    //- DONUT CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.
    var donutChartCanvas, pieChartCanvas, barChartCanvas;
    $.get("/sellerManageFunction/GetCategoryTotalSales", { async: false }, function (data) {
        var category = [];
        var sales = [];


        $.each(data, function (count, item) {

            category.push(item.categories.categoryName)
            sales.push(item.sales)
        })
        donutChartCanvas = $('#donutChart').get(0).getContext('2d')
        var donutData = {
            labels: category,
            datasets: [{
                data: sales,
                backgroundColor: ['rgba(255, 172, 0, 1)',
                    'rgba(255, 0, 0, 1)',
                    'rgba(0, 255, 225, 1)',
                    'rgba(104, 255, 0, 1)',
                    'rgba(0, 14, 255, 1)',
                    'rgba(151, 0, 255, 1)',
                    'rgba(255, 0, 210, 1)',
                    'rgba(255, 0, 78, 1)',
                    'rgba(255, 156, 0, 1)',
                    'rgba(156, 0, 255, 1)',
                    'rgba(92, 0, 255, 1)',
                    'rgba(255, 103, 0, 1)',
                    'rgba(255, 0, 189, 1)'],
                color: color
            }]
        }
        var donutOptions = {
            maintainAspectRatio: false,
            responsive: true,
        }
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        new Chart(donutChartCanvas, {
            type: 'doughnut',
            data: donutData,
            options: donutOptions
        })
    })
    //-------------
    //- PIE CHART -
    //-------------
    // Get context with jQuery - using jQuery's .get() method.

    $.get("/sellerManageFunction/GetTop5ProductSales", { async: false }, function (data) {
        var prodcut = [];
        var sales = [];

        $.each(data, function (count, item) {
            console.log(item)
            prodcut.push(item.name)
            sales.push(item.sales)
        })
        pieChartCanvas = $('#pieChart').get(0).getContext('2d')
        var pieData = {
            labels: prodcut,
            datasets: [{
                data: sales,
                backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc'],
                color: color
            }]
        };
        var pieOptions = {
            maintainAspectRatio: false,
            responsive: true,
        }
        //Create pie or douhnut chart
        // You can switch between pie and douhnut using the method below.
        new Chart(pieChartCanvas, {
            type: 'pie',
            data: pieData,
            options: pieOptions
        })
    })
    //-------------
    //- BAR CHART -
    //-------------


    $.get("/sellerManageFunction/GetMonthlyIncome", { async: false }, function (data) {
        //get Income array
        var monthlyIncom = [, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < 12; i++) {
            monthlyIncom[i] = data[i].toFixed(2)
        }
        var areaChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'Octopber', 'November', 'December'],
            datasets: [
                {
                    label: 'Income (RM) ',
                    backgroundColor: 'lightblue',
                    color: color,
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: monthlyIncom
                },

            ],

        }



        barChartCanvas = $('#barChart').get(0).getContext('2d')
        var barChartData = $.extend(true, {}, areaChartData)
        var temp0 = areaChartData.datasets[0]

        barChartData.datasets[0] = temp0


        var barChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            datasetFill: false,

        }

        new Chart(barChartCanvas, {
            type: 'bar',
            data: barChartData,
            options: barChartOptions
        })

    })



})