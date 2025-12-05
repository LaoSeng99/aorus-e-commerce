$(function () {

    var x;
    var image;
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

            $(".member-img").children().fadeOut(200, function () {
                $(this).attr("src", reader.result).fadeIn(200)
            })
   
        };

        reader.onerror = function (error) {
            alert('Invalid file type');

        };
    }


    $("#edit-picture-btn").change(function (event) {

        x = getBase64(event.target.files[0])


    })
 
    $.ajax({
        type: "GET",
        url: "/CustomerProfilesFunction/GetuserInfo",
        success: function (data) {
            console.log(data)
            $(".member-img").children().attr("src",data.imageUrl)
            $("#Info_FirstName").val(data.firstName)
            $("#Info_LastName").val(data.lastName)
            $("#User_Name").val(data.nickname)
            $("#details_email").val(data.email)
            $("#locale2").val(data.country)
            $("#Info_Gender option[value='" + data.gender + "']").attr('selected', true);
        }
    })
  
})
