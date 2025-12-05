// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(function () {
    if (sessionStorage.getItem('disclaimer_dismissed')) {
        $('#student-disclaimer').addClass('d-none');
    }


    $('#close-disclaimer').on("click", function () {
        $('#student-disclaimer').slideUp(300, function () {
            sessionStorage.setItem('disclaimer_dismissed', 'true');
        });
    });

    if (!sessionStorage.getItem('modal_dismissed')) {

        $("head").append(`
    <style>

    /* pop out*/
    .custom-model-main {
        text-align: center;
        overflow: hidden;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0; /* z-index: 1050; */
        -webkit-overflow-scrolling: touch;
        outline: 0;
        opacity: 0;
        -webkit-transition: opacity 0.15s linear, z-index 0.15;
        -o-transition: opacity 0.15s linear, z-index 0.15;
        transition: opacity 0.15s linear, z-index 0.15;
        z-index: -1;
        overflow-x: hidden;
        overflow-y: auto;
    }

    .model-open {
        z-index: 99999;
        opacity: 1;
        overflow: hidden;
    }

    .custom-model-inner {
        -webkit-transform: translate(0, -25%);
        -ms-transform: translate(0, -25%);
        transform: translate(0, -25%);
        -webkit-transition: -webkit-transform 0.3s ease-out;
        -o-transition: -o-transform 0.3s ease-out;
        transition: -webkit-transform 0.3s ease-out;
        -o-transition: transform 0.3s ease-out;
        transition: transform 0.3s ease-out;
        transition: transform 0.3s ease-out, -webkit-transform 0.3s ease-out;
        display: inline-block;
        vertical-align: middle;
        width: 800px;
        margin: 30px auto;
        max-width: 97%;
    }

    .custom-model-wrap {
        display: block;
        width: 100%;
        position: relative;
        background-color: rgba(0,0,0,.8);
        border: 1px solid #ff6400;
        border-radius: 6px;
        -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
        box-shadow: 0 3px 9px #ff6400;
        background-clip: padding-box;
        outline: 0;
        text-align: left;
        padding: 20px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        max-height: calc(100vh - 70px);
        overflow-y: auto;
    }

    .model-open .custom-model-inner {
        -webkit-transform: translate(0, 0);
        -ms-transform: translate(0, 0);
        transform: translate(0, 0);
        position: relative;
        z-index: 999;
    }

    .model-open .bg-overlay {
        background: rgba(0, 0, 0, 0.6);
        z-index: 99;
    }

    .bg-overlay {
        background: rgba(0, 0, 0, 0);
        height: 100vh;
        width: 100%;
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        -webkit-transition: background 0.15s linear;
        -o-transition: background 0.15s linear;
        transition: background 0.15s linear;
    }

    .closeSuccess-btn {
        position: absolute;
        right: 0;
        top: -30px;
        cursor: pointer;
        z-index: 99;
        font-size: 30px;
        color: #fff;
    }

    .pop-up-content-wrap {
        text-align: center;
        font-size: 24px;
    }

    @media screen and (min-width:800px) {
        .custom-model-main:before {
            content: "";
            display: inline-block;
            height: auto;
            vertical-align: middle;
            margin-right: -0px;
            height: 100%;
        }
    }

    @media screen and (max-width:799px) {
        .custom-model-inner {
            margin-top: 45px;
        }
    }
</style>
    `)

        $("body").append(`
    <div class="custom-model-main model-open">
    <div class="custom-model-inner">
        <div class="closeSuccess-btn">×</div>
        <div class="custom-model-wrap">
            <div class="pop-up-content-wrap fontAorus">
                <span>This project develop at 2022, Really a good time</span>  <br>
                <span style="font-weight:700;font-size:30px;color:#ff6400">This is a presentation page for assignment!</span> <br>
                <span style="font-weight:900;font-size:40px;color:Red   ;
                    text-shadow:1px 1px white;">*Not for any commercial use.*</span> <br>
                <span>
                    Most of design copy from Aorus MY official<br>
                    https://www.aorus.com/en-my
                </span> <br>
                <span>
                    <span style="color:orange   ">
                        If there is any infringement
                    </span> <br>
                    <span style="font-weight:900;font-size:40px;color:Red   ;
                    text-shadow:1px 1px white;">I apologize for this.</span> <br>
                    please contact *<span style="font-weight:900;font-size:24px;color:#ff6400">+60-149342218 or</br> ***REMOVED*** </span>* for closure.
                </span>
                <br>
                <span style="color:white">
            </div>
        </div>
    </div>
    <div class="bg-overlay"></div>
</div>
    `)

        $(".custom-model-main").addClass('model-open');

        $(".closeSuccess-btn, .bg-overlay").click(function () {
            $(".custom-model-main").removeClass('model-open');

            sessionStorage.setItem('modal_dismissed', 'true');
        });

    }
})