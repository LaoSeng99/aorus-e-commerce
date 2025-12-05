$(function () {
    $("#productImage img").mouseenter(function () {

        $("#BigShowImage").attr("src", $(this).attr("src"))

    })

    $('html, body').animate({
        scrollTop: $("#ProductCreate").offset().top + 10
    }, 'slow');

    $("#ToPreview").click(function () {
        $("#ProductCreate").slideUp(500, function () {
            $("#ProductPreview").slideDown(400)
            $('html, body').animate({
                scrollTop: $("#ProductPreview").offset().top
            }, 'slow');
        })
        if ($("#pdDiscount").val() != "0") {
            var disprice = ($("#pdPrice").val() * ((100 - $("#pdDiscount").val()) / 100))
                .toLocaleString("en-US", { style: "currency", currency: "MYR" }).replace("MYR", "RM");
       
            $(".afterDisPrice").text(disprice)


        } else {
            $(".afterDisPrice").text("RM " + $("#pdPrice").val())
        }


    })
    $("#ToCreate").click(function () {
        $("#ProductPreview").slideUp(500, function () {
            $("#ProductCreate").slideDown(400)
            $('html, body').animate({
                scrollTop: $("#ProductCreate").offset().top
            }, 'slow');
        })
    })

    function validateNull(string) {

        if (string.replaceAll(" ", "") == "") {
            return false
        } else {
            return true;
        }
    }
    function validateName(string) {

        if (string.length >= 10) {

            return true;
        } else {
            return false;
        }
    }
    function validateCategory(string) {
        if (string != "") {
            return true;
        } else {
            return false;
        }
    }
    function validateTag(string) {
        if (string.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    function validateDescription(string) {
        if (string.split(" ")[1] > 100) {
            return true;
        } else {
            return false;
        }
    }
    function validatePrice(string) {
        if (string > 0) {
            return true;
        } else if (string.includes("*") || string.includes("/") || string.includes("-") || string.includes("+")) {
            return false;
        }
        else {
            return false;
        }
    }
    function validateDiscount(string) {
        if (string < 0 || string >= 100) {
            return false;
        } else if (string.includes("*") || string.includes("/") || string.includes("-") || string.includes("+")) {
            return false;
        }
        else {
            return true;
        }
    }
    function validateStock(string) {
        if (string < 0) {
            return false;
        } else if (string.includes("*") || string.includes("/") || string.includes("-") || string.includes("+")) {
            return false;
        }
        else {
            return true;
        }
    }
    function validInput(object, status) {
        var errormsg = {
            "pdName": "**Product Name at least have 10 character ",
            "pdCategory": " **Category is required",
            "pdTag": "**At least one tag for the Product ",
            "pdPrice": "**Minumun price is queired (RM0.01) ",
            "pdDiscount": " **Discount only between 0~99.99%",
            "pdStock": " **Stock cannot be zero ",
        }

        if (status == true) {
            object.removeClass("is-invalid")
            object.next().fadeOut(300, function () {
                $(this).text("")
            })
            object.addClass("is-valid")

        } else {
            object.removeClass("is-valid")
            object.addClass("is-invalid")
            object.next().text(errormsg[object.attr("id")]).fadeIn(300)

        }
    }

    function livePreview(object) {
        var previewMsg = {
            "pdName": "#previewName",
            "pdPrice": "#previewOriginal",
            "pdDiscount": "#previewDiscount",
            "pdtitle": "#previewTitle",
        }

        $(previewMsg[object.attr("id")]).text(object.val())
    }
    function checkAllValue() {

        var image = "";

        if ($(".slide").length > 0) {
            $.each($(".slide"), function () {
                image += $(this).attr("src") + "|||"
            })
        }

        var checkName = validateName($("#pdName").val())
        var checkCate = validateCategory($("#pdCategory").val())
        var checkTag = validateTag($("#pdTag").val())
        var checkPrice = validatePrice($("#pdPrice").val())
        var checkDis = validateDiscount($("#pdDiscount").val())
        var checkStock = validateStock($("#pdStock").val())
        var checkImage = validateNull(image)

        var checkAllTrue = [checkName, checkTag, checkCate, checkPrice, checkDis, checkStock, checkImage]

        if (checkAllTrue.every(function (x) { return x == true })) {

            return true
        } else {

            return false
        }
    }

    $("input, select").on("change paste keyup", function () {

        var checkInput = {
            "pdName": validateName($(this).val()),
            "pdCategory": validateCategory($(this).val()),
            "pdTag": validateTag($(this).val()),
            "pdPrice": validatePrice($(this).val()),
            "pdDiscount": validateDiscount($(this).val()),
            "pdStock": validateStock($(this).val()),
            "pdtitle": true,
        }

        validInput($(this), checkInput[$(this).attr("id")])
        livePreview($(this))
        checkAllValue()
    })

    editor1.attachEvent("change", function () {
        $("#previewDescription").html(editor1.getHTMLCode())
        if (editor1.getText().length < 100) {
            $("#inp_editor1").next().fadeIn(200)

            return;
        } else {
            $("#inp_editor1").next().fadeOut(200)

        }
    });

    $(".Create").click(function () {
        if (checkAllValue() == true) {

            $(".pop-up-content-wrap").html("Create Success!<br /> Close this window back to ProductList")

            var image = [];
            $.each($(".slide"), function () {
                image.push($(this).attr("src"))
            })

            var NewProduct = new Object();
          
            NewProduct.Name = $("#pdName").val();
            NewProduct.Tag = $("#pdTag").val();
            NewProduct.Title = $("#pdtitle").val();
            NewProduct.Description = editor1.getHTMLCode();
            NewProduct.Price = $("#pdPrice").val();
            NewProduct.Discount = $("#pdDiscount").val();
            NewProduct.Stock = $("#pdStock").val();
            NewProduct.CategoriesId = $("#pdCategory").val();

            $.ajax({
                type: "POST",
                url: "/sellerFunction/CreateProduct",
                data: { NewProduct },
                success: function (pid) {



                    $.ajax({
                        type: "POST",
                        url: "/sellerFunction/uploadImage",
                        data: { imageArray: image, productId: pid },
                        success: function (data) {

                            $(".custom-model-main").addClass('model-open');

                            $(".closeSuccess-btn, .bg-overlay").click(function () {
                                $(".custom-model-main").removeClass('model-open');
                                location.href = "/Seller_Manage/Products_List"
                            });
                        }
                    })

                }
            })
        }
        else {
            $(".pop-up-content-wrap").html(" Something wrong!<br /> Please check all necessary field is completed and correct")
            $(".custom-model-main").addClass('model-open');

            $(".closeSuccess-btn, .bg-overlay").click(function () {
                $(".custom-model-main").removeClass('model-open');

            });
        }

    })

    $(".SaveBtn").click(function () {
        var check = checkAllValue()
        if (check == true) {

            $(".pop-up-content-wrap").html("Save Change Success!<br /> Close this window back to ProductList")

            var image = [];
            $.each($(".slide"), function () {
                image.push($(this).attr("src"))
            })

            var NewProduct = new Object();
            NewProduct.ProductId = edit
            NewProduct.Name = $("#pdName").val();
            NewProduct.Tag = $("#pdTag").val();
            NewProduct.Title = $("#pdtitle").val();
            NewProduct.Description = editor1.getHTMLCode();
            NewProduct.Price = $("#pdPrice").val();
            NewProduct.Discount = $("#pdDiscount").val();
            NewProduct.Stock = $("#pdStock").val();
            NewProduct.CategoriesId = $("#pdCategory").val();

            $.ajax({
                type: "POST",
                url: "/sellerManageFunction/SaveEditInfo",
                data: { newProduct: NewProduct, image: image },
                success: function (pid) {




                    $(".custom-model-main").addClass('model-open');

                    $(".closeSuccess-btn, .bg-overlay").click(function () {
                        $(".custom-model-main").removeClass('model-open');
                        location.href = "/Seller_Manage/Products_List"

                    })

                }
            })
        }
        else {
            $(".pop-up-content-wrap").html(" Something wrong!<br /> Please check all necessary field is completed and correct")
            $(".custom-model-main").addClass('model-open');

            $(".closeSuccess-btn, .bg-overlay").click(function () {
                $(".custom-model-main").removeClass('model-open');

            });
        }

    })
    var numImage = 0;
    function getBase64(file) {

        var reader = new FileReader();
        reader.readAsDataURL(file);

        var filePath = file.value;

        // Allowing file type


        if (file.size > 3097152) {
            alert("File is too big!");
            return false;
        };


        reader.onload = function () {
            var image = $(".slide")

            if (image.length + 1 == 6) {
                $("#file-upload").prev().hide();
            }
            $("#BigShowImage").fadeOut(200, function () {
                $("#BigShowImage").attr("src", reader.result).fadeIn(200)


            })

            $("#file-upload").prev().before(`
           <img class="slide Image-${image.length + 1}"height="120" width="120" src="${reader.result}"lazy="loaded" />
                                                                                                                                                                                                                                                                                                                                                                                                                `)
            checkAllValue()
            $("#productImage img").mouseenter(function () {
                var thisSrc = $(this).attr("src")
                $("#BigShowImage").fadeOut(200, function () {
                    $("#BigShowImage").attr("src", thisSrc).fadeIn(200)

                })
            })
            $(".slide").click(function () {
                $(this).remove();
                $("#BigShowImage").fadeOut(200)
                if ($(".slide").length < 6) {
                    $("#file-upload").prev().show();
                }
            })
        };

        reader.onerror = function (error) {
            alert('Invalid file type');

        };
    }
    var x;
    var image;
    $("#file-upload").change(function (event) {

        x = getBase64(event.target.files[0])


        $("#BigShowImage").fadeIn(200)


    })

    $.ajax({
        type: "GET",
        url: "/sellerFunction/GetCategoryList",
        success: function (data) {
       
            $.each(data, function (count, item) {
                console.log(item)
                $("#pdCategory").append(`
              <option value="${item.id}"> ${item.categoryName.replaceAll('_', ' ')}</option>
            `)

            })
        }
    })

    var edit = document.URL.split("Edit_Product?productid=")[1]
 
    if (typeof edit !== "undefined") {

        $.post("/sellerManageFunction/getProductDetails", { productId: edit }, function (data) {
            console.log(data)
            $("#pdName,#previewName").val(data.product.name);
            $("#pdtitle,#previewTitle").val(data.product.title);
            $("#pdTag").val(data.product.tag);
            $("#pdPrice").val(data.product.price);
            $("#pdDiscount").val(data.product.discount);
            $("#pdStock").val(data.product.stock);
            editor1.setHTMLCode(data.product.description);
            $("#previewOriginal").text(` ${data.product.price.toFixed(2)}`);
            $("#previewDiscount").text(`- ${data.product.discount}`);
            $(`#pdCategory option`).attr("selected", false)
            $(`#pdCategory option[value='${data.product.categories.id}']`).attr("selected", true)

            //Image Field
            var image = 0;
            $.each(data.images, function (count, item) {

                if (image + 1 == 6) {
                    $("#file-upload").prev().hide();
                }
                $("#file-upload").prev().before(`
           <img class="slide Image-${image + 1}"height="120" width="120" src="${item.imageUrl}"lazy="loaded" /> `)
                image++;
            })
            checkAllValue()
            $("#productImage img").mouseenter(function () {
                var thisSrc = $(this).attr("src")
                $("#BigShowImage").fadeOut(200, function () {
                    $("#BigShowImage").attr("src", thisSrc).fadeIn(200)

                })
            })
            $(".slide").click(function () {
                $(this).remove();
                $("#BigShowImage").fadeOut(200)
                if ($(".slide").length < 6) {
                    $("#file-upload").prev().show();
                }
            })
            //End

        })
    }
})