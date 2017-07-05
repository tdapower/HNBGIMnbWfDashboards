require(['jquery', 'placeholder' /*, 'embed'*/ ], function($) {

    // Placeholder text
    // http://mths.be/placeholder v2.0.8 by @mathias
    $('input, textarea').placeholder();

    // Background-size
    // https://github.com/louisremi/jquery.backgroundSize.js by @louis_remi
    // $(".main_content .promo .box_card").css({
    //     backgroundSize: "cover"
    // });

    // // Expand header
    // $('.img_header .hover').click(function() {
    //     console.log('yes');
    //     $('#tagline .icon').toggleClass('ie');
    // });

    // $(function() {

    // });

    // Flat-accordion fix: main content container needs height adjustment
    $('.build_flat_accordion .accordion').click(function() {
        var accordion_height = $(this).height(),
            body = $(this).closest('.main_content'),
            body_height = body.height();
        if ($(this).hasClass('accordion_closed')) {
            body_height = body_height - accordion_height;
            body.css({
                body: body_height
            }).addClass('z').removeClass('z'); // add/remove class to update DOM
        } else {
            body_height = body_height + accordion_height;
            body.css({
                body: body_height
            }).addClass('z').removeClass('z'); // add/remove class to update DOM
        }
    });

});