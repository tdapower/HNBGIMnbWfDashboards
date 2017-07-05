var dependencies = [
        'jquery',
        'knob'
    ];

require(dependencies, function($) {

    // ------------------------------------------------
    // jQuery-Knob
    // https://github.com/aterrien/jQuery-Knob
    // ------------------------------------------------
    $(".knob").knob({
        // Using draw as callback function to change extra hbs container (not input value from plugin manipulation)
        draw: function () {
            var element = $('.knob_data'),
                value = $('.knob_data').text(),
                valueStr = value.split('.');
            element.html(valueStr[0] + '<span>.' + valueStr[1] + '%</span>')
        }
    });

});