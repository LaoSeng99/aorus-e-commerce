
$(function () {

    setTimeout(function () {
        var Checkbox = $(".control-sidebar-dark").find(".os-content").find("div.mb-4 span:contains('Dark Mode')")

        if (localStorage.getItem('mode') == 'dark') {
            Checkbox.prev().prop("checked", true)
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
    //Top 3 Sales
    //---------------------
    //- STACKED BAR CHART -
    //---------------------
    $.get("/AdminFunction/GetTopThreeSeller", function (data) {
        var seller1 = new Object()
        var order1 = [, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var seller2 = new Object()
        var order2 = [, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var seller3 = new Object()
        var order3 = [, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


        $.each(data, function (sellerCount, item) {
            switch (sellerCount) {
                case 0: seller1 = item.seller; break;
                case 1: seller2 = item.seller; break;
                case 2: seller3 = item.seller; break;
            }
            $.each(item.orders, function (count, item) {
                switch (sellerCount) {
                    case 0: order1[count] = item; break;
                    case 1: order2[count] = item; break;
                    case 2: order3[count] = item; break;
                }

            })

        })

        var stackedBarChartCanvas = $('#stackedBarChart').get(0).getContext('2d')
        var stackedBarChartData = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Augest', 'September', 'Octopber', 'November', 'December'],
            datasets: [
                {
                    label: seller1.name,
                    backgroundColor: 'rgba(60,141,188,0.9)',
                    borderColor: 'rgba(60,141,188,0.8)',
                    pointRadius: false,
                    pointColor: '#3b8bba',
                    pointStrokeColor: 'rgba(60,141,188,1)',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(60,141,188,1)',
                    data: order1
                },
                {
                    label: seller2.name,
                    backgroundColor: 'rgba(210, 214, 222, 1)',
                    borderColor: 'rgba(210, 214, 222, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: order2
                },
                {
                    label: seller3.name,
                    backgroundColor: 'rgba(53,154, 232, 1)',
                    pointRadius: false,
                    pointColor: 'rgba(210, 214, 222, 1)',
                    pointStrokeColor: '#c1c7d1',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220,220,220,1)',
                    data: order3
                },
            ]
        }



        var stackedBarChartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    stacked: true,
                }],
                yAxes: [{
                    stacked: true
                }]
            }
        }

        new Chart(stackedBarChartCanvas, {
            type: 'bar',
            data: stackedBarChartData,
            options: stackedBarChartOptions
        })
    })


    $.get("/AdminFunction/GetAllCategorySales", function (data) {
        var category = [];
        var sales = [];

        $.each(data, function (count, item) {

            category.push(item.categories.categoryName)
            sales.push(item.sales)
        })
        var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
        var pieData = {
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
                    'rgba(255, 0, 189, 1)']
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

})