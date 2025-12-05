$(function () {



    getSellerList()

    function getSellerList() {

        $("#SellerList").html("")
        $.get("/AdminFunction/GetSellerList").done(function (data) {
            $.each(data, function (count, item) {

                var regis = new Date(item.registered_At);
                var timeRegis = new Date(regis).toLocaleTimeString()
                var dateRegis = new Date(regis).toLocaleDateString();

                var aprTime = item.approval_At


                var apr = new Date(aprTime);
                var timeapr = new Date(apr).toLocaleTimeString()
                var dateapr = new Date(apr).toLocaleDateString();


                var color = item.isActive == true ? "green" : "gray"
                var storeColor = item.isActive == true ? "blue" : "gray"

                $("#SellerList").append(`
                          <tr class="jsgrid-row" data-sellerRow="">

                         <td class="jsgrid-cell jsgrid-align-center" style="width: 50px;">
                                <input style="width:20px;height:20px" type="checkbox"class="selectSellerBox" value='${item.sellerId}'>
                            </td>
                                <td class="jsgrid-cell jsgrid-align-center id" style="width: 50px;">
                                   ${item.id}
                             </td>
                                <td class="jsgrid-cell Firstname" style="width: 125px;">
                                          ${item.name}
                                </td>
 
                                <td class="jsgrid-cell email" style="width: 125px;">
                                      ${item.email}
                                </td>
                                <td class="jsgrid-cell jsgrid-align-center phone" style="width:120px;">
                                          ${item.phoneNumber}
                                </td>
                                <td class="jsgrid-cell jsgrid-align-center statusSeller" style="width: 50px;">
                                    <i class="fa fa-check-circle sellerStatus" data-sellerId="${item.sellerId}"
                                       style="background-color:transparent;border:none;margin-left:10px;font-size:24px ;color:${color}!important;cursor:pointer;"></i>
                                </td>
                      
                                <td class="jsgrid-cell jsgrid-align-center time" style="width: 130px;">
                                    ${dateapr}<br/>${timeapr}
                                </td>
  <td class="jsgrid-cell jsgrid-align-center time" style="width: 130px;">
                                    ${dateRegis}<br/>${timeRegis}
                                </td>
     <td class="jsgrid-cell jsgrid-align-center statusSeller" style="width: 80px;">
                                    <i class='fa fa-store-alt' data-SellerId="${item.sellerId}"
                                       style="background-color:transparent;border:none;margin-left:10px;font-size:24px ;color:${storeColor}!important;cursor:pointer;"></i>
                                </td>
                                 <td class="jsgrid-cell jsgrid-align-center statusSeller" style="width: 80px;">
                         <i class="fa fa-pie-chart SellerStatisticsBtn"data-sellerId="${item.sellerId}"
style="font-size:24px;color:#ff6400;cursor:pointer"></i>
                                          </td>
                            </tr>

`)

            })


            $(".selectSellerBox").click(function () {
                //Active Multi Select
                //Counting
                var selectedCount = $(".selectSellerBox:checked")

                if (selectedCount.length == 0) {
                    $("#SellerAllSelect").prop("checked", false)
                    //If Dont Have, hidden the button
                    $(".multiBtnSellerContainer").fadeOut(300)
                }
                else if (selectedCount.length == $(".selectSellerBox").length) {
                    $(".multiBtnSellerContainer").fadeIn(300)
                    //If All has checked
                    $("#SellerAllSelect").prop("checked", true)
                }
                else {
                    //If have any checked, show the button
                    $(".multiBtnSellerContainer").fadeIn(300)
                }
            })
            $("#SellerAllSelect").click(function () {
                //Get SelectAll 'checked' value
                var value = $(this).prop("checked");
                if (value == false) {
                    $(".multiBtnSellerContainer").fadeOut(300)
                } else {
                    $(".multiBtnSellerContainer").fadeIn(300)
                }
                //Set To Every selectBox
                $.each($(".selectSellerBox"), function () {
                    $(this).prop("checked", value)
                })

            })

            $(".sellerStatus").click(function () {

                var sellerId = $(this).attr("data-sellerId")

                $.post("/AdminFunction/ChangeSellerStatus", { SellerId: sellerId }, function (data) {
                    if (data == false) {
                        $(`.sellerStatus[data-sellerId='${sellerId}']`).css("color", "gray")
                    } else {
                        $(`.sellerStatus[data-sellerId='${sellerId}']`).css("color", "green")
                    }
                })
            })
            $(".fa-store-alt").click(function () {

                $("#SellerAllSelect").prop("checked", false)
                //If Dont Have, hidden the button
                $(".multiBtnSellerContainer").fadeOut(300)
                $(".products-row").remove();
                var sellerName = $(this).parents("tr").find(".Firstname").text()
                $("#ProductList").text(`Product List of ${sellerName}`).fadeIn(300);
                var sellerId = $(this).attr("data-SellerId")
                $.ajax({
                    type: "POST",
                    url: "/AdminFunction/ListProduct",
                    data: { SellerId: sellerId },
                    success: function (data) {

                        $(".SellerInfo").fadeOut(400, function () {
                            $(".ProductList").fadeIn(400)
                        })

                        for (var i = 0; i < data.length; i++) {
                            $("#MyTable tbody").append(`
                     <tr class="products-row" style="display:none;padding-right:5px">

                              <td class="  sbox" >
                    </td>

                      <td class="product-cell image name">
             
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

                        $(".productCircle").click(function () {
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

            })
            $(".SellerStatisticsBtn").click(function () {
                var sellerName = $(this).parents("tr").find(".Firstname").text()
                $("#Statistics").text(`Statistics of ${sellerName}`).fadeIn(300)
                var sellerId = $(this).attr("data-sellerId")
                console.log(sellerId)
                $.get("/AdminFunction/GetCategoryTotalSales", { sellerId: sellerId }, function (data) {
                    var category = [];
                    var sales = [];

                    $.each(data, function (count, item) {

                        category.push(item.categories.categoryName)
                        sales.push(item.sales)
                    })
                    var donutChartCanvas = $('#donutChart').get(0).getContext('2d')
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
                                'rgba(255, 0, 189, 1)']
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
                $.get("/AdminFunction/GetTop5ProductSales", { sellerId: sellerId }, function (data) {
                    var prodcut = [];
                    var sales = [];

                    $.each(data, function (count, item) {

                        prodcut.push(item.name)
                        sales.push(item.sales)
                    })
                    var pieChartCanvas = $('#pieChart').get(0).getContext('2d')
                    var pieData = {
                        labels: prodcut,
                        datasets: [{
                            data: sales,
                            backgroundColor: ['#f56954', '#00a65a', '#f39c12', '#00c0ef', '#3c8dbc'],
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
                $.get("/AdminFunction/GetMonthlyIncome", { sellerId: sellerId }, function (data) {
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
                                borderColor: 'rgba(60,141,188,0.8)',
                                pointRadius: false,
                                pointColor: '#3b8bba',
                                pointStrokeColor: 'rgba(60,141,188,1)',
                                pointHighlightFill: '#fff',
                                pointHighlightStroke: 'rgba(60,141,188,1)',
                                data: monthlyIncom
                            },

                        ]
                    }


                    var barChartCanvas = $('#barChart').get(0).getContext('2d')
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
                $(".SellerInfo").fadeOut(400, function () {
                    $(".StatisticsList").fadeIn(400);
                })


            })
        })
    }
    function getUnApprovalList() {
        $("#UnApprovalList").html("")

        $.get("/AdminFunction/GetUnApprovalList").done(function (data) {
            $.each(data, function (count, item) {
                console.log(data)
                var regis = new Date(item.registered_At);
                var timeRegis = new Date(regis).toLocaleTimeString()
                var dateRegis = new Date(regis).toLocaleDateString();

                var color = item.isActive == true ? "green" : "gray"
                var storeColor = item.isActive == true ? "blue" : "gray"

                $("#UnApprovalList").append(`
         <tr class="jsgrid-row" data-sellerRow="">
                                <td class="jsgrid-cell jsgrid-align-center id" style="width: 50px;">
                                    ${item.id}
                                </td>
                                <td class="jsgrid-cell Firstname" style="width: 125px;">
                                          ${item.name}
                                </td>
 
                                <td class="jsgrid-cell email" style="width: 125px;">
                                      ${item.email}
                                </td>
                                <td class="jsgrid-cell jsgrid-align-center phone" style="width:120px;">
                                          ${item.phoneNumber}
                                </td>
                                <td class="jsgrid-cell jsgrid-align-center statusSeller" style="width: 50px;">
                                    <i class="fa fa-check-circle ApprovalBtn" data-sellerId="${item.sellerId}"
                                       style="background-color:transparent;border:none;margin-left:10px;font-size:24px ;color:${color}!important;cursor:pointer;"></i>
                                </td>
                      
                                <td class="jsgrid-cell jsgrid-align-center time" style="width: 130px;">
                                   <br/>-
                                </td>
  <td class="jsgrid-cell jsgrid-align-center time" style="width: 130px;">
                                    ${dateRegis}<br/>${timeRegis}
                                </td>
     <td class="jsgrid-cell jsgrid-align-center statusSeller" style="width: 80px;">
    <i class='fas fa-edit editSeller'data-SellerId="${item.sellerId}"
                  style='margin-left:5px;font-size:24px;color:blue;
                   background-color:transparent;border:none;margin-left:10px;
                font-size:24px ;cursor:pointer;'></i>

                                    
                                </td>
                            </tr>

`)
                $(".ApprovalBtnInfo").attr("data-SellerId", item.sellerId)

            })
            $(".editSeller").click(function () {
                var sellerId = $(this).attr("data-SellerId")
                $(".ApprovalBtnInfo").attr("data-SellerId", sellerId)
                $("#UnApprovalList").fadeOut(300, function () {
                    $("#InforTable").fadeIn(300)
                    GetSellerDetails(sellerId)

                })
            })

            //$(".ApprovalBtn").click(function () {
            //    var btn =$(this)
            //    var selledId = $(this).attr("data-sellerId")

            //    $.post("/AdminFunction/ApprovalSeller", { SellerId: selledId }, function () {
            //        btn.parents("tr").fadeOut(300, function () {
            //            $(this).remove()
            //        })
            //    })
            //})


        })

    }

    $(".BackToApprovalList").click(function () {
        $("#InforTable").fadeOut(300, function () {
            getUnApprovalList()
            $("#UnApprovalList").fadeIn(300)
        })
    })
    $(".ApprovalBtnInfo").click(function () {

        var sellerId = $(this).attr("data-sellerId")

        $.post("/AdminFunction/ApprovalSeller", { SellerId: sellerId }, function () {
            $("#InforTable").fadeOut(300, function () {
                getUnApprovalList()
                $("#UnApprovalList").fadeIn(300)
            })
        })
    })

    $("#activeSelectedSeller").click(function () {
        //Open an array to store ProductId has selected
        var SellerArray = [];

        //Foreach every selectBox has checked
        $.each($(".selectSellerBox:checked"), function () {
            //Push into array
            SellerArray.push($(this).val())
            // CSS
            var SellerRow = $(this).parents("tr")
            SellerRow.find(".sellerStatus").css("color", "green")
            //End

        })
        //Calling AJAX to effect the change, Pass the Array ProductId
        //Controller --
        //  Foreach(var product in ProductIdArray){
        //        db.ProductTable.FirstOrDefault(e=>e.ProductId==product)!.Active =true;
        //        }
        // db.saveChange();
        // return Json("");

        $.post("/AdminFunction/MultiActiveSeller", { SellerIdArray: SellerArray });
    })
    $("#disabledSelectedSeller").click(function () {
        //Open an array to store ProductId has selected
        var SellerArray = [];

        //Foreach every selectBox has checked

        $.each($(".selectSellerBox:checked"), function () {
            //Push into array
            SellerArray.push($(this).val())
            // CSS
            var SellerRow = $(this).parents("tr")
            SellerRow.find(".sellerStatus").css("color", "gray")
        })
        //Calling AJAX to effect the change, Pass the Array ProductId
        //Controller --
        //  Foreach(var product in ProductIdArray){
        //        db.ProductTable.FirstOrDefault(e=>e.ProductId==product)!.Active =false;
        //        }
        // db.saveChange();
        // return Json("");
        $.post("/AdminFunction/MultiDisabledSeller", { SellerIdArray: SellerArray });
    })



    function GetSellerDetails(sellerId) {

        $.post("/AdminFunction/GetSellerInfo", { SellerId: sellerId }, function (data) {

            $("#SellerInfoName").val(data.name)
            $("#SellerInfoEmail").val(data.email)
            $("#SellerInfoPhone").val(data.phoneNumber)
            $("#SellerInfoAdl1").val(data.addressLine1)
            $("#SellerInfoAdl2").val(data.addressLine2)
            $("#SellerInfoCity").val(data.city)
            $("#SellerInfoState").val(data.state)
            $("#SellerInfoZipCode").val(data.zipCode)

        })
    }

    //Show List Table 
    $("#ProductList").click(function () {
        $(".SellerInfo,.approvalList").fadeOut(300, function () {
            $("#ProductList").fadeIn(300)
        })

    })
    $("#sellerList").click(function () {
        $("#SelectAll").prop("checked", false)
        //If Dont Have, hidden the button
        $(".multiBtnContainer").fadeOut(300)
        getSellerList()
        $("#ProductList,.ProductList,.approvalList,.StatisticsList,#Statistics").fadeOut(300, function () {
            setTimeout(function () {
                $(".SellerInfo").fadeIn(300)
            }, 300)
        })
    })

    $("#UnapprovalList").click(function () {
        getUnApprovalList()
        $("#ProductList,.ProductList,.SellerInfo,.StatisticsList,#Statistics").fadeOut(300, function () {
            setTimeout(function () {
                $(".approvalList").fadeIn(300)
            }, 300)
        })
    })

    //Filter
    $(".UnAprinput").keyup(function () {
        $(`UnAprinput:not([id='${$(this).attr('id')}'])`).val("")

        var value = $(this).val().toLowerCase()
        console.log($(this).attr("id"))
        switch ($(this).attr("id")) {
            case "id":
                $("#UnApprovalList tr td.id").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;

            case "Fname":
                $("#UnApprovalList tr td.Firstname").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "Lname":
                $("#UnApprovalList tr td.Lastname").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "email":
                $("#UnApprovalList tr td.email").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "phone":
                $("#UnApprovalList tr td.phone").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
        }
    })
    $(".Sellinput").keyup(function () {
        $(`input:not([id='${$(this).attr('id')}'])`).val("")

        var value = $(this).val().toLowerCase()
        console.log($(this).attr("id"))
        switch ($(this).attr("id")) {
            case "id":
                $("#SellerList tr td.id").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;

            case "Fname":
                $("#SellerList tr td.Firstname").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "Lname":
                $("#SellerList tr td.Lastname").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "email":
                $("#SellerList tr td.email").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "phone":
                $("#SellerList tr td.phone").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
        }
    })
    $("#StatusBtn").click(function () {

        console.log($(this).css("color"))

        if ($(this).css("color") == "rgb(0, 0, 255)") {

            $(this).css("color", "green")
            $("#SellerList tr td.statusSeller .sellerStatus").filter(function () {
                console.log($(this).css("color"))
                $(this).parents("tr").toggle($(this).css("color") == "rgb(0, 128, 0)")
            });
        } else if ($(this).css("color") == "rgb(0, 128, 0)") {

            $(this).css("color", "gray")
            $("#SellerList tr td.statusSeller .sellerStatus").filter(function () {
                $(this).parents("tr").toggle($(this).css("color") != "rgb(0, 128, 0)")
            });


        } else {
            $(this).css("color", "blue")
            $("#SellerList tr").show();
        }

    })


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
<a style="color:inherit">
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
<i class="fa fa-check-circle productCircle" data-productId = ${object.product.productId}
style="margin-left:10px;font-size:24px ;color:${color}
!important;cursor:pointer;"></i>


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
