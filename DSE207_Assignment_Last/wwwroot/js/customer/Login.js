
$(function () {

    $('.form').find('input, textarea').on('keyup blur focus', function (e) {

        var $this = $(this),
            label = $this.prev('label');

        if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.addClass('active highlight');
            }
        }
        else if (e.type === 'blur') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
            } else {
                label.removeClass('highlight');
            }
        } else if (e.type === 'focus') {

            if ($this.val() === '') {
                label.removeClass('highlight');
            }
            else if ($this.val() !== '') {
                label.addClass('highlight');
            }
        }

    });
    //Log IN, Sign Up Form Changing
    $('.tab .FormButton').on('click', function (e) {
        $('.tab .FormButton').removeClass("active")
        $(this).parent().siblings().removeClass('active');
        $(this).parent().addClass('active');
        e.preventDefault();

        target = $(this).val();
        $('.tab-content > div').not(target).hide();

        $(target).fadeIn(600);
        if (target == "#login") {
            $('html, body').animate({
                scrollTop: $(target).offset().top - 240
            }, 'slow');
        } else {
            $('html, body').animate({
                scrollTop: $(target).offset().top - 120
            }, 'slow');
        }
    });

    function LoadingAnimate() {
        $("#loading-div").addClass("active show");
        setTimeout(function () {
            $("#loading-div").removeClass("active show");
        }, 600);
    }
    function LoadingAnimateTIMER(TIMER) {
        $("#loading-div").addClass("active show");
        setTimeout(function () {
            $("#loading-div").removeClass("active show");
        }, TIMER);
    }
    function ScrollBack(target) {

        var value = {
            "#login": 240,
            "#signup": 30,
            "#Acdetails": 50,
            "#changePasswordForm": 200,
            "#addressDetail": 80,
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
            "resetPass": "#errorReset"
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

    function inputCorrect(object) {
        object.removeClass("Show");
        object.next().removeClass("active")
    }

    function passwordFormat(password, type) {

        function checkFormat(str) {
            if (str == "") {
                return "required";
            } else if (str.length < 8) {
                return "length";
            } else if (!wordWithNumber(password)) {
                return "format";
            } else {
                return "";
            }
        }
        var stringType = {
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
    function confirmPasswordCheck(pass, reConfirm) {
        if (pass == reConfirm) {
            return true;
        } else {
            return "The Password confirmation does not match."
        }

    }

    function wordWithNumber(str) {

        return /^([a-zA-Z-0-9]+)$/.test(str) && /\d/.test(str) && /[A-Z]/i.test(str);
    }
    function checkEmail(string) {
        return !(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(string)) ?
            "Please enter a valid email address." : true;
    }
    function checkEmailExist(string) {
        //Ajax Check

        var check;
        $.ajax({
            type: "POST",
            url: "/CustomerLoginFunction/CheckEmailExist",
            async: false,
            data: { email: string.trim() },
            success: function (data) {
                check = data == "NotExist" ? true : "The email already registed, Try another."

            }
        })
        return check;
    }
    function checkNinkname(string) {
        if (string.trim() == "") {
            return "The Nick name field is required."
        } else if (string.length < 8) {
            return "The Nick name should be at least 8 characters"
        } else {
            return true;
        }
    }
    function checkPhone(string) {
        return !(/^(\+?6?01)[02-46-9]-*[0-9]{7}$|^(\+?6?01)[1]-*[0-9]{8}$/.test(string)) ?
            "Please enter Malaysia Phone Format" : true;
    }
    function checkPhoneExist(Phone) {
        var check;
        $.ajax({
            type: "POST",
            url: "/CustomerLoginFunction/CheckPhoneberExist",
            async: false,
            data: { phone: Phone.trim() },
            success: function (data) {
                check = data == "NotExist" ? true : "The phone number already registed, Try another."

            }
        })
        return check;
    }
    function checkOtpPass(string) {
        console.log(string)
        if (string.length == 6)
            $("#regis_EnterOTP").attr("disabled", false)
        else
            $("#regis_EnterOTP").attr("disabled", true)
    }
    var regisEmail, regisName, regisPass, regisPhone, OtpCheck;
    var loginEmail, loginPass;
    $("input").change(function () {
        $("#errorRegister").children().children().html("")
        $("#errorLogin").children().children().html("")
        $("#errorReset").children().children().html("")

        var inputId = $(this).attr("id")
        var value = $(this).val()

        switch (inputId) {
            case "regis_Email":
                var check = checkEmail(value)
                check == true ? inputCorrect($(this)) : ErrorInput("register", check, $(this));

                if (check == true) {
                    var exist = checkEmailExist(value)
                    console.log(exist)
                    exist == true ? inputCorrect($(this)) : ErrorInput("register", exist, $(this));

                    if (exist == true) {
                        regisEmail = value;
                        $("#errorRegister").hide();
                        break;
                    }
                }


                regisEmail = "";
                $("#registerBtn").attr("disabled", true);
                return;

                break;
            case "regis_NickName":
                var check = checkNinkname(value);

                check == true ? inputCorrect($(this)) : ErrorInput("register", check, $(this));

                if (check == true) {
                    regisName = value;
                    $("#errorRegister").hide();
                    break;
                }

                $("#registerBtn").attr("disabled", true)
                regisName = "";
                return;
            case "regis_Password":
                var check = passwordFormat(value, "");

                check == true ? inputCorrect($(this)) : ErrorInput("register", check, $(this));

                if (check == true) {

                    $("#errorRegister").hide();
                    return;
                }

                $("#registerBtn").attr("disabled", true)
                return;
            case "regis_re-Password":

                var check = passwordFormat(value, "re-enter");
                check == true ? inputCorrect($(this)) : ErrorInput("register", check, $(this));

                if (check == true) {
                    var confirm = confirmPasswordCheck($("#regis_Password").val(), value)
                    confirm == true ? inputCorrect($(this)) : ErrorInput("register", confirm, $(this));

                    if (confirm == true) {
                        $("#errorRegister").hide();
                        regisPass = value;
                        break;
                    }

                }

                regisPass = "";
                $("#registerBtn").attr("disabled", true)
                return;
            case "regis_Phone":
                var check = checkPhone(value.replaceAll(" ", ""))
                check == true ? inputCorrect($(this)) : ErrorInput("register", check, $(this));

                if (check == true) {
                    var exist = checkPhoneExist(value)
                    exist == true ? inputCorrect($(this)) : ErrorInput("register", exist, $(this));

                    if (exist == true) {

                        $("#errorRegister").hide();
                        $("#regis_GetotpBtn").attr("disabled", false)
                        break;

                    }
                    $("#regis_GetotpBtn").attr("disabled", true)
                }
            case "login_Email":
                var check = checkEmail(value);
                if (check != true) {

                    check = checkPhone(value);
                    if (check != true) {
                        loginEmail = ""
                        ErrorInput("login", "Please Enter a valid Email or Phone Number", $(this))
                        $("#loginBtn").attr("disabled", true)

                        return;
                    }
                }

                loginEmail = value;
                inputCorrect($(this))
                $("#errorLogin").hide();
                break;
            case "login_Password":
                var check = passwordFormat(value, "");

                check == true ? inputCorrect($(this)) : ErrorInput("login", check, $(this));

                if (check == true) {
                    loginPass = value
                    $("#errorLogin").hide();
                    break;
                }

                loginPass = ""
                $("#loginBtn").attr("disabled", true)
                return;
            case "EmailPhoneInput": {
                var check = checkEmail(value);
                if (check != true) {

                    check = checkPhone(value);
                    if (check != true) {
                        $("#sendOTP").attr("disabled", true)
                        ErrorInput("resetPass", "Please Enter a valid Email or Phone Number", $(this))
                        return;
                    }
                }

                inputCorrect($(this))
                $("#sendOTP").attr("disabled", false)
                $("#errorReset").hide();
                break;
            }
            default: return;

        }
        if (inputId.includes("regis")) {
            checkRegisValue()
            return;
        }
        checkLoginValue();

    })
    $(document).on("keydown", "#login input", function (event) {
        if (event.key == "Enter") {
            $("#loginBtn").click()
        }
        return event.key != "Enter";
    });
    $("#regis_GetotpBtn").click(function () {

        $(this).parent().fadeOut(400, function () {
            $(this).next().fadeIn(400, function () {
                var msg = $(this)
                $.post("/CustomerLoginFunction/OTPsend",
                    { phoneNumber: $("#regis_Phone").val() },
                    function (data) {
                        console.log(data)
                        OtpCheck = data;
                        msg.children(".mes").text("The OTP has sended to " + $("#regis_Phone").val())

                    })
            })
        })
    })
    $("#regis_EnterOTP").click(function () {
        $("#errorRegister").children().children().html("");

        var otpPass = $("#regis_Enterotp").val()

        if (otpPass == OtpCheck) {

            $(this).parent().fadeOut(400, function () {
                $(this).prev().fadeIn(400, function () {

                    regisPhone = $("#regis_Phone").val();
                    $(this).children(".mes").text("Verify has been success.")
                    $("#regis_Phone").attr("readonly", true)
                    $("#regis_GetotpBtn").attr("disabled", true)
                    $("#errorRegister").hide()
                    checkRegisValue()
                })
            })
        }
        else {
            $("#regis_Enterotp").addClass("Show").next().addClass("active")
            $("#errorRegister").show().children().children().html("Wrong OTP password try again")

        }
    })
    $("#regis_Enterotp").keyup(function () {
        checkOtpPass($(this).val())
    })
    $("#regis_TryAnother").click(function () {
        $(this).parent().parent().fadeOut(400, function () {
            $(this).prev().fadeIn(400, function () {

            })
        })
    })
    function checkRegisValue() {
        $("#registerBtn").attr("disabled", true)
        var checkArray = [regisEmail, regisName, regisPass, regisPhone]
        var trueCount = 0;
        checkArray.forEach(function (data) {
            if (typeof data === "undefined") {
                console.log(data)
                trueCount--;
            }
            if (data != "") {
                console.log(data)
                trueCount++;
            }

        })
        if (trueCount == 4) {
            $("#registerBtn").attr("disabled", false)
            console.log(open)
            return;
        }

    }
    function checkLoginValue() {
        var checkArray = [loginEmail, loginPass]
        var trueCount = 0;
        checkArray.forEach(function (data) {
            if (data != "") {
                trueCount++;

            }

        })
        if (trueCount == 2) {
            $("#loginBtn").attr("disabled", false)
        }
    }
    $("#registerBtn").click(function () {
        LoadingAnimate()
        ScrollBack("#signup")

        var newCustomer = new Object();

        newCustomer.Email = regisEmail
        newCustomer.Password = regisPass
        newCustomer.NickName = regisName
        newCustomer.PhoneNumber = regisPhone
        $.ajax({
            type: "POST",
            url: "/CustomerLoginFunction/Register",
            data: { newCustomer },
            success: function (data) {

                $(".custom-model-main").addClass('model-open');

                $(".closeSuccess-btn, .bg-overlay").click(function () {
                    $(".custom-model-main").removeClass('model-open');
                    location.href = "/CustomerLogin/Login"
                });
            }
        })
    })
    $("#loginBtn").click(function () {
        LoadingAnimate()
        ScrollBack("#login")

        var EorP = checkEmail(loginEmail) == true ? "Email" : "Phone"

        $.ajax({
            type: "POST",
            url: "/CustomerLoginFunction/Login",
            async: false,
            data: { login: loginEmail, loginId: EorP, password: loginPass },
            success: function (data) {
                if (data == "Faild") {
                    $("#errorLogin").children().children().text("")
                    $("#login_Password").val("")
                    $("#loginBtn").attr("disabled", true)
                    ErrorInput("login", "The Email/Phone or Password is incorrect, Please try again.", $("#login_Password"))
                    return;
                } else {

                    location.href = "/Store/Home"
                }

            }
        })
    })
 
    var resetOtp;
    $("#sendOTP").click(function () {
        LoadingAnimate()
        var EorP = checkEmail($("#EmailPhoneInput").val()) == true ? "Email" : "Phone"
    
        $.post("/CustomerLoginFunction/ResetPassCheckExist", { AccountId: $("#EmailPhoneInput").val(), type: EorP }, function (data) {
            if (data == "NotExist") {

                $("#errorReset").show().children().children().text("The Email/Phone number not exist")
                return;
            }
            else {
                if (EorP == "Email") {
                    $.post("/CustomerLoginFunction/SendResetEmailOtp", { sendEmail: $("#EmailPhoneInput").val() }, function (data) {

                        resetOtp = data
                    })
                }
                else {
                    $.get("/CustomerLoginFunction/ResetOTPsend", { phoneNumber: $("#EmailPhoneInput").val() }, function (data) {

                        resetOtp = data
                    })
                }
                $("#OtpPass").keyup(function () {
                    console.log($(this).val())

                    if ($(this).val().length == 6) {

                        $("#ResetPassword").attr("disabled", false)
                    } else {
                        $("#ResetPassword").attr("disabled", true)
                    }

                })
                $("#sendOTP").fadeOut(300, function () {
                    $("#EmailPhoneInput").attr("readonly", true)
                    $("#OtpPass").parent().fadeIn(300)
                    $("#ResetPassword").fadeIn(300)
                })

                $("#ResetPassword").click(function () {
                  
                    if ($("#OtpPass").val() == resetOtp) {
                        LoadingAnimateTIMER(2800)
                        $("#errorReset").hide()

                        $.post("/CustomerLoginFunction/ResetPassword", { AccountId: $("#EmailPhoneInput").val(), type: EorP }, function () {

                            $(".custom-model-main").addClass('model-open');

                            $(".closeSuccess-btn, .bg-overlay").click(function () {
                                $(".custom-model-main").removeClass('model-open');
                                location.href = "/CustomerLogin/Login"
                            });
                          
                        })
                    } else {
                        LoadingAnimateTIMER(200)
                        $("#errorReset").show().children().children().text("The OTP password verify faild, try again")
                    }

                })
            }
        })





    })

    $(".togglePassword").click(function () {
       
        var x = $(this).parent().find(".Logininput");
     
        if (x.attr("type") === "password") {
            x.attr("type","text");
        } else {
            x.attr("type", "password");
   
        }
    })
})