require(['jquery'], function($) {

    $(function() {

        $('#dir_link').each(function() {
            // var _ajaxReadyToFire = true,
            directoryURL = $(this).data("link");
            // $(this).click(function(e) {
            // if ((_ajaxReadyToFire == "undefined") || (_ajaxReadyToFire == true)) {
            $("#directory").append('<div class="loading center"></div>');
            $.ajax({
                url: directoryURL,
                cache: true,
                type: 'GET',
                data: {},
                dataType: 'html',
                success: function(data) {
                    $("#directory").html($(data).find("#content"));
                },
                error: function(jqXHR, exception) {
                    var error = '';
                    if (jqXHR.status === 0) {
                        error = 'Not connect.\n Verify Network.';
                    } else if (jqXHR.status == 404) {
                        error = 'Requested page not found. [404]';
                    } else if (jqXHR.status == 500) {
                        error = 'Internal Server Error [500].';
                    } else if (exception === 'parsererror') {
                        error = 'Requested JSON parse failed.';
                    } else if (exception === 'timeout') {
                        error = 'Time out error.';
                    } else if (exception === 'abort') {
                        error = 'Ajax request aborted.';
                    } else {
                        error = 'Uncaught Error.\n' + jqXHR.responseText;
                    }
                    $("#directory").html('') // clear loading spinner
                        .append('<div class="pad center"><span class="icon icon_before color_alert" data-icon="error"></span>Directory information could not be loaded. <a href="mailto:uconnect@uwhealth.org?Subject=U-Connect Directory Tab Not Loading&body=[Page URL] ' + window.location + ', [Errors logged] ' + error + '">Please let us know about it.</a></div>');
                },
                complete: function() {
                    _ajaxReadyToFire = false;
                }
            });
            // } else {
            // e.preventDefault();
            // }
            // });
        });

    });

});