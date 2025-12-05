$(function () {

    $("#AdminloginBtn").click(function () {
        var username = $("#username").val();
        var password = $("#password").val();
 
        if (username == "" || password == "") {
          
            $("#erroMsg").show()
            return;
        }
        else {
            $("#erroMsg").hide()
            $.post("/AdminFunction/Login", { name: username, pass: password }, function (data) {
                if (data == false) {
                    $("#erroMsg").show()
                } else {
                    location.href="/Admin/Dashboard"
                }
            })
        }
        
    })
})