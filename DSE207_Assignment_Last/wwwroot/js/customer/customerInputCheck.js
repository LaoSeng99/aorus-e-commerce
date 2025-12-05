$(function () {



    function LoadingAnimate() {
        $("#loading-div").addClass("active show");
        setTimeout(function () {
            $("#loading-div").removeClass("active show");
        }, 600);
    }
    function ScrollBack(target) {

        var value = {
            "#login": 240,
            "#signup": 30,
            "#Acdetails": 50,
            "#changePasswordForm": 200,
            "#addressDetail": 100,
        };
        $('html, body').animate({
            scrollTop: $(target).offset().top - value[target]
        }, 'slow');

    }

    function ErrorInput(type, input, show_object) {
        var functionType = {
            "login": "#errorLogin",
            "register": "#errorRegister",
            "accountDetails": "#errorSave",
            "changePwd": "#errorChangePwd",
            "addressSave": "#errorAddress",
        }
        function showError(target) {
            $(target).css("display", "").children().children().append(`
                       ${input}</br>
                              `);;
        }
        show_object.addClass("Show");
        show_object.next().addClass("active")
        return showError(functionType[type]);

    }

    function checkSamePass(pass, reConfirm) {
        if (pass == reConfirm) {
            return true;
        } else {
            return "The Password confirmation does not match."
        }

    }
    function inputCorrect(object) {
        object.removeClass("Show");
        object.next().removeClass("active")
    }

    function alphabetWithNumbers(str) {

        return /^([a-zA-Z-0-9]+)$/.test(str) && /\d/.test(str) && /[A-Z]/i.test(str);
    }

    function checkingTrue(list) {
        return list.every(function (x) { return x == true })
    }


    function CheckInput(str, type) {
        var OnlySpace = str.replaceAll(" ", "") == "" ? true : false;

        var inputType = {
            "first": "The first name",
            "nickname": "The nick name",
            "last": "The last name",
            "address": "The address line 1",
            "city": "The address city",
            "zipcode": "The address post code",
            "phone": "The address phone number",
            "country": "The address country",

        }
        function checkStr(str) {
            if (str == "") {
                return inputType[type] + " field is required."
            } else if (OnlySpace) {
                return inputType[type] + " is not allow only spaced."
            } else {
                return true;
            }
        }

        return checkStr(str);
    }
    function passwordFormat(password, type) {

        function checkFormat(str) {
            if (str == "") {
                return "required";
            } else if (str.length < 8) {
                return "length";
            } else if (!alphabetWithNumbers(password)) {
                return "format";
            } else {
                return "";
            }
        }
        var stringType = {
            "old": "The Old",
            "new": "The New",
            "confirmation": "The Confirmation",
            "re-enter": "The Re-enter",
            "": "The",
        }

        var wrongType = {
            "required": stringType[type] + " Password field is required.",
            "length": stringType[type] + " Password must be at least 8 characters.",
            "format": stringType[type] + " Password must be 8 to 20 characters, with a least one numeric character [0-9] and one letter. Space is not allowed.",
            "": true,

        }
        return wrongType[checkFormat(password)]
    }



    //================= navbar =================

    $("#mb-menuBtn").click(function () {
        if ($(this).hasClass("open")) {
            $(this).removeClass("open")
            $(this).next().slideUp(200);
        } else {
            $(this).addClass("open")
            $(this).next().slideDown(200);
        }

    })
    //========== Account Details ==============
    $("#Info_Gender").change(function () {
        $("#Info_Gender option").attr("selected", false)
        $("#Info_Gender option[value='" + $(this).val() + "']").attr("selected", true)

    })
    $("#saveInfoBtn").click(function () {
        //Loading animation
        LoadingAnimate()
        ScrollBack("#Acdetails")
        //empty ErrorMsg
        $("#errorSave").children().children().html("")

        var nickname = CheckInput($("#User_Name").val())
        var firstname = $("#Info_FirstName").val();
        var lastname = $("#Info_LastName").val();
        var gender = $("#Info_Gender").val();
        var Image = $(".member-img").children().attr("src")

        if (nickname != true) {

            ErrorInput("accountDetails", nickname, $("#User_Name"))
        } else {
            //Ajax to update

            var newinfo = new Object();
            newinfo.FirstName = firstname
            newinfo.Gender = gender
            newinfo.LastName = lastname
            newinfo.Nickname = nickname
            newinfo.ImageUrl = Image
            $.post("/CustomerProfilesFunction/UpdateBasic", { newinfo: newinfo }, function () {
                inputCorrect($("#User_Name"))
                $("#errorSave").css("display", "")
                $("#errorSave").children().children().append(`
                       Your profile has been saved.</br>  `);
            })
        }

    })
    //========== Account Change Password ==========

    $("#changePwdBtn").click(function () {

        //Loading animation
        LoadingAnimate()
        ScrollBack("#changePasswordForm")
        //empty ErrorMsg
        $("#errorChangePwd").children().children().html("")
        //checking
        var old = passwordFormat($("#old_pwd").val(), "old")
        //Checking old password

        old != true ? ErrorInput("changePwd", old, $("#old_pwd"))
            : inputCorrect($("#old_pwd"))

        var new_pw = passwordFormat($("#new_pwd").val(), "new")
        //Checking new password
        new_pw != true ? ErrorInput("changePwd", new_pw, $("#new_pwd"))
            : inputCorrect($("#new_pwd"))

        var new_pw_confirmation = passwordFormat($("#new_pwd_confirmation").val(), "confirmation")
        //Checking confirmation password
        new_pw_confirmation != true ? ErrorInput("changePwd", new_pw_confirmation, $("#new_pwd_confirmation"))
            : inputCorrect($("#new_pwd_confirmation"))


        let checkingTrue = [old, new_pw, new_pw_confirmation];



        if (checkingTrue.every(function (x) { return x == true })) {

            var OldPass;

            $.ajax({
                type: "POST",
                url: "/CustomerProfilesFunction/CheckOldPass",
                async: false,
                data: { password: $("#old_pwd").val() },
            }).done(function (data) {
                data == "success" ? OldPass = true : OldPass = false;
            })

            if (OldPass == false) {
                $("#new_pwd, #new_pwd_confirmation").val("")
                ErrorInput("changePwd", "Old password verify faild", $("#old_pwd"))
                return;
            }

            var confirmPass = checkSamePass($("#new_pwd").val(), $("#new_pwd_confirmation").val());
            if (confirmPass == true) {
                $.ajax({

                    type: "POST",
                    url: "/CustomerProfilesFunction/ChangePassword",
                    data: { newPass: $("#new_pwd").val() },
                    success: function (data) {

                        $(".custom-model-main").addClass('model-open');

                        $(".closeSuccess-btn, .bg-overlay").click(function () {
                            $(".custom-model-main").removeClass('model-open');

                            $.ajax({
                                type: "POST",
                                url: "/CustomerProfilesFunction/Logout",
                            }).done(function () {
                                location.href = "/CustomerLogin/Login"
                            })
                        });
                    }
                })
            }
            else {
                $("#new_pwd_confirmation").val("");
                ErrorInput("changePwd", confirmPass, $("#new_pwd_confirmation"));

            }

        }


    })

    //========== Account Change Address ============
    $("#addressSave").click(function () {
        //Loading animation
        LoadingAnimate()
        ScrollBack("#addressDetail")
        //reset the error message
        $("#errorAddress").children().children().html("")

        var addressL1 = CheckInput($("#Address_Line1").val(), "address")
        var city = CheckInput($("#Address_City").val(), "city")
        var zipCode = CheckInput($("#Address_PostCode").val(), "zipcode")
        var country = CheckInput($("#country").val(), "country")

        // Checking addressL1
        addressL1 != true ? ErrorInput("addressSave", addressL1, $("#Address_Line1"))
            : inputCorrect($("#Address_Line1"));
        // Checking city
        city != true ? ErrorInput("addressSave", city, $("#Address_City"))
            : inputCorrect($("#Address_City"));
        // Checking zipCode
        zipCode != true ? ErrorInput("addressSave", zipCode, $("#Address_PostCode"))
            : inputCorrect($("#Address_PostCode"));
        // Checking country
        country != true ? ErrorInput("addressSave", country, $("#locale"))
            : inputCorrect($("#locale"));

        var CheckAllTrue = [addressL1, city, zipCode, country];

        var state = $("#Address_State").val()
        var addressL2 = $("#Address_Line2").val();



        if (checkingTrue(CheckAllTrue)) {

            var newInfo = new Object();
            newInfo.AddressLine1 = $("#Address_Line1").val();
            newInfo.AddressLine2 = addressL2;
            newInfo.City = $("#Address_City").val();
            newInfo.State = state;
            newInfo.ZipCode = $("#Address_PostCode").val()
            newInfo.Country = $("#country").val()
          
            $.ajax({
                type: "POST",
                url: "/CustomerProfilesFunction/UpdateAddress",
                data: newInfo,
                success: function () {

                    $("#errorAddress").css("display", "")
                    $("#errorAddress").children().children().append(`
                       Your shipping address has been saved.</br>

                              `);
                }

            })
        }
    })

})
