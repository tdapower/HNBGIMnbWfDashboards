var dependencies = [
        'jquery',
        'toggle'
    ];

require(dependencies, function($) {

    $(function() {

        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initialize all accordions
        ////////////////////////////////////////////////////////////////////////////////////////////////////////
        function initAccordions() {
            $(".accordion").each(function(i) {
                var container = $(this),
                    keywordTag_check = container.find('a').hasClass('tag');
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
                            container.toggleClass('accordion_closed ');
                        });
                    } else {
                        container.removeClass('accordion');
                    }
                } else {
                    // Apply accordion_closed class to all accordions
					// Unless js_accordion_open exists
                    container.not(".js_accordion_open")
					.addClass("accordion_closed");
                    // Setup click toggle-event
                    container.click(function(e) {
						if (!container.hasClass('accordion_split')){
							container.toggleClass('accordion_closed accordion_open');
						}
                    });
                }
            });
        }
        initAccordions();

    });

});
