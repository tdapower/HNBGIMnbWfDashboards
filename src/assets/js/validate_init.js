var dependencies = [
        'jquery',
        'validate'
    ];

require(dependencies, function($) {

    // ------------------------------------------------
    // Modify Default Plugin Settings
    // ------------------------------------------------
    // Messages

    jQuery.extend(
        jQuery.validator.messages, {
            required: "This field is required.",
            remote: "Please fix this field.",
            email: "Please enter a valid email address.",
            url: "Please enter a valid URL.",
            date: "Please enter a valid date.",
            dateISO: "Please enter a valid date (ISO).",
            number: "Please enter a valid number.",
            digits: "Please enter only digits.",
            creditcard: "Please enter a valid credit card number.",
            equalTo: "Please enter the same value again.",
            accept: "Please enter a value with a valid extension.",
            maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
            minlength: jQuery.validator.format("Please enter at least {0} characters."),
            rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
            range: jQuery.validator.format("Please enter a value between {0} and {1}."),
            max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
            min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
        },
        jQuery.validator.setDefaults({
            // Error Element
            debug: true,
            error_classes: "msg msg_error validation_error error",
            success_classes: "icon_success validation_success success",
            ignore: ".js_ignore_validation",
            errorElement: "span",
            // Error Placement
            errorPlacement: function(error, element, error_classes, success_classes) {
                var $validation_container = element.prev('.validation'),
                    $label = $validation_container.parent('label');

                $label.removeClass('success').addClass('error contain');
                $validation_container.removeClass(this.success_classes)
                    .addClass(this.error_classes);

                error.appendTo(
                    $validation_container.find('.validation_body')
                );

            },
            success: function(label, element) {
                // console.log('success handler');
                var $element = $(element),
                    $validation_container = $element.prev('.validation'),
                    $label = $(element.labels[0]);

                $label.removeClass('error').addClass('success contain');
                $validation_container.removeClass(this.error_classes)
                    .find('.error').remove();

                if( $element.attr('type') !== 'number' ){
                    $validation_container.addClass(this.success_classes);
                }
            }/*,
            invalidHandler: function(element) {
                element.parent().attr('data-icon', 'error').removeClass('icon_success').addClass('icon_error');
            }*/
        })
    );


    $(document).ready(function() {

        // ------------------------------------------------
        // Add error/success icon container
        // ------------------------------------------------
        var elements_to_validate = $(".validate").find('input, textarea, select').not('input[type=button], input[type=submit], input[type=reset]');

        $(elements_to_validate).each(function(){
            $this = $(this);
            var validation_insert = "<div class='validation absolute'><div class='validation_body'></div></div>";
            if( ! $this.prev().hasClass('validation') ){
                $this.before(validation_insert);
            }
        });
        $('.validation').addClass('icon');
        $('.validation').parent('label').addClass('contain');
        $('.validation_body').addClass('msg_body');
        $('input[type=button], input[type=submit], input[type=reset]').addClass('js_ignore_validation');

        // validate_icon.insertAfter(elements_to_validate);

        // ------------------------------------------------
        // Initialize
        // ------------------------------------------------
        $(".validate").validate();

        // ------------------------------------------------
        // Make sure errors are thrown on keyup
        // ------------------------------------------------
        // // $(document).click(function() {
        //     elements_to_validate.on("propertychange blur change keyup keypress input paste click", function() {
        //         // elements_to_validate.each(function() {

        //             if ($(this).hasClass('error')) {
        //                 $(this).parent().attr('data-icon', 'error').removeClass('icon_success').addClass('icon_error');
        //             }
        //         // });
        //     /*});*/
        // });

    });

});
