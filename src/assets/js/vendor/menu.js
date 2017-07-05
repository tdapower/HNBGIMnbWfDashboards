var dependencies = [
        'jquery',
        'general_functions',
        'tabs'
    ];

require(dependencies, function($, gf) {

    $(document).on('click', 'body', function(e) {
        if ($('#mega_buttons .tab').hasClass('active')) {
            if (gf.check_click($('#mega_nav'), e) === false && gf.check_click($('#mega_buttons'), e) === false && gf.check_click($('[data-toggle="#mega_nav"]'), e) === false) {
                $('#mega_nav').find('.tab_button.active').removeClass('active')
                $('#mega_buttons').find('.active').removeClass('active');
                // $('#mega_nav').not('.active').find('.tab_content:visible')
                $('#mega_nav > .tabbed > .tab_content:visible')
                    .velocity({
                        "margin-top": [0, 0],
						scaleY: ["0.00001", [.41, -0.5, 0, 1.14], "1"],
						//cubic-bezier(.41, -0.5, 0, 1.14)
                        translateY: ["-1%", [.31, -0.41, .5, .59], "0"],
                        opacity: [0, "easeOut", 1]
                    }, {
                        display: "none"
                    }, {
                        duration: 40
                    });
                if ($('#mega_nav').hasClass('active')) {
                    $('[data-toggle="#mega_nav"]').click();
                }
            }
        }
    });

    $(function() {

        // Duplicate each utility nav link for mobile, a give appropriate style classes
        $('#utilities a').each(function() {
            $(this).clone()
                .appendTo($('#mega_nav > .tabbed'))
                .addClass('tab_button utility_tab tab_link')
                .attr('data-tabbed', 'true');
        });

    });

});