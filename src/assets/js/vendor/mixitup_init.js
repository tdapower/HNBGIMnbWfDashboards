var dependencies = [
        'jquery',
        'mixitup',
        'mixitup_debug'
    ];

require(dependencies, function($) {

    // don't load on lte ie8
    if (!$('html').hasClass('lte8')) {

		// called after the initial sort.  this re-enables animations (by setting the animation duration higher than 0).
        // it's important that the initial sort (before this call) has no animation, otherwise elements hidden inside tabs get broken.
        function mixAfter(state) {
            $("#mixableContainer").mixItUp(
                'setOptions', {
                    animation: {
                        effects: 'fade translateZ(-360px) scale(0.5)',
                        easing: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
                        duration: 120,
						queue: true,
						queueLimit: 2
                    },
					callbacks: {
						onMixEnd: null
					}
				}
			);
        }

        // initial configuration: animation duration of 0 (instant animations).  this is immediately changed after the first sort, inside mixAfter().
        // important that the first sort has a duration of 0 to keep it from breaking inside of tabs.
        $("#mixableContainer").mixItUp({
            animation: {
                duration: 0,
                queue: true,
                queueLimit: 3,
                animateResizeContainer: false
            },
            controls: {
                activeClass: ''
            },
            debug: {
                enable: true,
                mode: 'verbose'
            },
            layout: {
                containerClass: 'mixitup'
            },
            load: {
                filter: "all",
                sort: "category:asc name:asc"
            },
            callbacks: {
                onMixEnd: function(){
                    $("#mixableContainer").find('.loading').remove();
                    mixAfter();
                }
            },
            selectors: {
                sort: '.sort'
            }
        }).addClass('mix_initiated');

        // add sorting controls to each sorting <li> "button".
        $("#sorting li").each(function (index, element) {
            $(element).click(function () {
                sortMixItUp($(this).attr('value'), $(this));
                $(this).addClass("active").siblings("li").removeClass("active");
            });
        });

        // if only Category exists on this page, and not also ORG, use a simplified version of filtering...
        if ($("li[data-type=mixitup_org_select]").length == 0) {
            $("li[data-type=mixitup_category_select]").click(function () {
                $('#mixableContainer').mixItUp('filter', $(this).attr('data-value'));
            });
        } else { // this is a page with both Category and ORG filters, so set both of those up in a specific way...

            $("li[data-type=mixitup_category_select]").click(function () {
                category = $(this).attr('data-value');
                mixFilterCategoryAndOrg();
            });

            $("li[data-type=mixitup_org_select]").click(function () {
                org = $(this).attr('data-value');
                mixFilterCategoryAndOrg();
            });
        }

        // sorts the elements, given a sort order (example: "name:asc").  this is called via the onclick handlers (attached above) of the sort controls (the <li> tags).
        // also, in cases of A-Z or Z-A sorting, this adds classes to categories the container ("categoryHidden" and "sorted", respectively) in order to display categories
        // in a special way.
        function sortMixItUp(attr, $this) {
            $("#mixableContainer").mixItUp('sort', attr);
            if ($this.hasClass('cat_hide')) {
                $(".mix.category").addClass('categoryHidden');
                $("#mixableContainer").addClass("sorted");
            } else {
                $(".mix.category").removeClass('categoryHidden');
                $("#mixableContainer").removeClass("sorted");
            }
        }

        function mixFilterCategoryAndOrg() {
            var category = ($("#mixableFilterCategory").val());
            var org = ($("#mixableFilterOrg").val());
            var filterString = "";
            if (category !== "all") {
                filterString += "." + category;
            } else {
                filterString += "all";
            }

            if (org !== "all") {
                if (filterString === "all") {
                    filterString = "." + org;
                } else {
                    filterString += "." + org;
                }
            }

            $("#mixableContainer").mixItUp("filter", filterString);
        }

    }
});