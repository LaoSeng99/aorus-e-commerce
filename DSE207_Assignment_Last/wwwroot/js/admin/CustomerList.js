$(function () {
    $.get("/AdminFunction/GetCustomerList", function (data) {
        $.each(data, function (count, item) {
            console.log(item)
            var d = new Date(item.register_At);
            var time = new Date(d).toLocaleTimeString()
            var date = new Date(d).toLocaleDateString();

            var color = item.isActive == true ? "green" : "gray"

            $("#UserList").append(`
         <tr class="jsgrid-row" data-customerRow="">

                                <td class="jsgrid-cell jsgrid-align-center" style="width: 50px;">
                                <input style="width:20px;height:20px" type="checkbox"class="selectBox" value='${item.customerId}'  >
                                 </td>
                                <td class="jsgrid-cell jsgrid-align-center id" style="width: 50px;">
                                    ${item.id}
                                </td>
                                <td class="jsgrid-cell Firstname" style="width: 125px;">
                                          ${item.firstName}
                                </td>
    <td class="jsgrid-cell Lastname" style="width: 125px;">
                                          ${item.lastName}
                                </td>
                                <td class="jsgrid-cell email" style="width: 150px;">
                                      ${item.email}
                                </td>
                                <td class="jsgrid-cell jsgrid-align-center phone" style="width:120px;">
                                          ${item.phoneNumber}
                                </td>
                                <td class="jsgrid-cell  jsgrid-align-center " style="width: 100px;">
                                    <i class="fa fa-check-circle customerStatus" data-customerId="${item.customerId}"
                                       style="margin-left:10px;font-size:24px ;color:${color}!important;cursor:pointer;"></i>
                                </td>
                                <td class="jsgrid-cell jsgrid-align-center time" style="width: 130px;">
                                    ${date}<br/>${time}
                                </td>
                            </tr>

`)
        })

        $(".customerStatus").click(function () {

            var customerId = $(this).attr("data-customerId")

            $.post("/AdminFunction/ChangeCustomerStatus", { CustomerId: customerId }, function (data) {
                if (data == false) {
                    $(`.customerStatus[data-customerId='${customerId}']`).css("color", "gray")
                } else {
                    $(`.customerStatus[data-customerId='${customerId}']`).css("color", "green")
                }
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
    })

    $("input").keyup(function () {
        $(`input:not([id='${$(this).attr('id')}'])`).val("")
        var value = $(this).val().toLowerCase()
        switch ($(this).attr("id")) {
            case "id":
                $("#UserList tr td.id").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;

            case "Fname":
                $("#UserList tr td.Firstname").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "Lname":
                $("#UserList tr td.Lastname").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "email":
                $("#UserList tr td.email").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
            case "phone":
                $("#UserList tr td.phone").filter(function () {
                    $(this).parent().toggle($(this).text().toLowerCase().indexOf(value) > -1)
                });
                break;
        }
    })

    $("#StatusBtn").click(function () {

        console.log($(this).css("color"))

        if ($(this).css("color") == "rgb(0, 0, 255)") {

            $(this).css("color", "green")
            $("#UserList tr td .customerStatus").filter(function () {
                console.log($(this).css("color"))
                $(this).parents("tr").toggle($(this).css("color") == "rgb(0, 128, 0)")
            });
        } else if ($(this).css("color") == "rgb(0, 128, 0)") {

            $(this).css("color", "gray")
            $("#UserList tr td .customerStatus").filter(function () {
                $(this).parents("tr").toggle($(this).css("color") != "rgb(0, 128, 0)")
            });


        } else {
            $(this).css("color", "blue")
            $("#UserList tr").show();
        }

    })

    $("#activeSelectedCustomer").click(function () {
        //Open an array to store ProductId has selected
        var CustomerArray = [];

        //Foreach every selectBox has checked
        $.each($(".selectBox:checked"), function () {
            //Push into array
            CustomerArray.push($(this).val())
            // CSS
            var CustomerRow = $(this).parents("tr")
            CustomerRow.find(".customerStatus").css("color", "green")
            //End

        })
        //Calling AJAX to effect the change, Pass the Array ProductId
        //Controller --
        //  Foreach(var product in ProductIdArray){
        //        db.ProductTable.FirstOrDefault(e=>e.ProductId==product)!.Active =true;
        //        }
        // db.saveChange();
        // return Json("");

        $.post("/AdminFunction/MultiActiveCustomer", { CustomerIdArray: CustomerArray });
    })

    $("#disabledSelectedCustomer").click(function () {
        //Open an array to store ProductId has selected
        var CustomerArray = [];

        //Foreach every selectBox has checked

        $.each($(".selectBox:checked"), function () {
            //Push into array
            CustomerArray.push($(this).val())
            // CSS
            var CustomerRow = $(this).parents("tr")
            CustomerRow.find(".customerStatus").css("color", "gray")
        })
        //Calling AJAX to effect the change, Pass the Array ProductId
        //Controller --
        //  Foreach(var product in ProductIdArray){
        //        db.ProductTable.FirstOrDefault(e=>e.ProductId==product)!.Active =false;
        //        }
        // db.saveChange();
        // return Json("");
        $.post("/AdminFunction/MultiDisabledCustomer", { CustomerIdArray: CustomerArray });
    })


})