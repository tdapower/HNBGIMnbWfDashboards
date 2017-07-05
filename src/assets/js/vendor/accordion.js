require(['jquery', 'faq', 'footer', 'velocity'], function($) {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // General
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Setup elements that need accordion added
    $(".has_children").addClass("accordion");



    $('.build_flat_accordion .column > ul > li > ul > li').addClass("accordion");

    // Sidenav
    $("#sidebar .list_bordered ul li").has("ul").addClass("accordion");
    $("[class*='multilevel_linkul']").parent("li").addClass("accordion");

    function setupAccordions() {

        $(".accordion").each(function(i) {
            var container = $(this),
                keywordTag_check = container.find('a').hasClass('tag');

			//Add icon classes to accordions
			$(container).addClass('icon icon_right');
            // Check for keyword tags
            if (keywordTag_check === true) {

                // Check to make sure list is taller than container, to ensure accordion is necessary
                var container_height = container.height(),
                    list_height = container.find('ul').height();

                if (list_height >= container_height) {
                    // Apply accordion_closed class to all accordions (so as to leave open for no-js)
                    container.addClass("accordion_closed");
                    // Setup click toggle-event
                    container.click(function(e) {
                        container.toggleClass('accordion_closed');
                    });
                } else {
                    container.removeClass('accordion');
                }

            } else {
                // Apply accordion_closed class to all accordions (so as to leave open for no-js)
                container.addClass("accordion_closed");
                // Setup click toggle-event
                container.click(function(e) {
                    container.toggleClass('accordion_closed');
                });
            }

        });

    }

    $(function() {
        setupAccordions();
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Tagline / Tag bar / Keyword-tags bar
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // var $overview = $("#overview"),
    //     $tagline = $("#tagline");

    // console.log('$overview: ' + overview);
    // console.log('$tagline: ' + tagline);

    // // if ($tagline.length > 0) {
    // //     //$overview.insertAfter($tagline).removeAttr("id").removeAttr("href");
    // //     $overview = $tagline.parent();
    // // };

    // if (($overview.children().length > 1) || ($tagline.children().length > 1)) {
    //     $overview.addClass("accordion accordion_closed");
    //     $tagline.addClass("hide");
    // };

    // $overview.click(function() {
    //     $tagline.toggleClass("hide");
    // });

});