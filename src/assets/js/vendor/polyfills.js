var dependencies = [
        'jquery'
    ];

require(dependencies, function($) {

    // ------------------------------------------------
    // Browser Check: =IE
    // ------------------------------------------------
    if ($('html').hasClass('ie')) {
        require(['polyfills_ie']);
    }

    // ------------------------------------------------
    // Browser Check: =IE8
    // ------------------------------------------------
    if ($('html').hasClass('ie8')) {
        require(['polyfills_ie8']);
    }

    // ------------------------------------------------
    // Browser Check: <=IE8
    // ------------------------------------------------
    if ($('html').hasClass('lte8')) {
        require(['polyfills_lte_ie8']);
    }

    // ------------------------------------------------
    // Browser Check: =IE9
    // ------------------------------------------------
    if ($('html').hasClass('ie9')) {
        require(['polyfills_ie9']);
    }

    // ------------------------------------------------
    // Browser Check: <=IE9
    // ------------------------------------------------
    if ($('html').hasClass('lte9')) {
        require(['polyfills_lte_ie9']);
    }

});