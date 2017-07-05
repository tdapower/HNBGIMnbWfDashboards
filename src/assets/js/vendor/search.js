require(['jquery', 'velocity', 'general_functions'], function($, velocity) {

    if (!$('html').hasClass('lte8')) { // don't load on lte ie8

        //If Megamenu or search shade is clicked outside of while active, then we hide them.

		var $srch_options = $("#search_options"),
			$srch_column = $("#search_column"),
			$srch_shade = $("#search_shade"),
			$srch_close = $("#search_close"),
			$main_search = $('#global_search');

        var searching = function(focused) {

			var focus_target = $(focused).attr('data-focus');

			if($(focus_target).hasClass('search_active') === false){

				$srch_shade.velocity({
					height: "100%"
				},{
					easing: [ 0.175, 0.885, 0.32, 1.275 ],
					duration: 300
				});
				$srch_close.velocity("fadeIn", {
					duration: 200,
					delay: 100,
					easing: "easeOut",
					queue: false
				}).velocity({
					scaleY: ["1", [0.175, 0.885, 0.32, 1.275], "0.1"],
					scaleX: ["1", [0.175, 0.885, 0.32, 1.275], "0.1"]
				},{
					duration: 300,
					delay: 120
				});
				$srch_options.velocity("slideDown", {
					queue: false,
					easing: [ 0.175, 0.885, 0.32, 1.275 ],
					duration: 350,
				}).velocity({
					top: ["6em",[ 0.175, 0.885, 0.32, 1.275 ],".75em"],
					paddingTop: ["48px", [.3, .27, .32, 1.31],"0px"]
				},{
					duration: 380
				})
				;
				$srch_column.velocity({
					width: "100%",
					top: ["7px","2px"]
				},{
					duration: 450,
					easing: "easeIn",
				},{
					complete: toggle_search(focus_target)
				});
			}else{
				$srch_shade.velocity("reverse",{
					easing: [.44, -0.5, .39, 1.01]
				});
				$srch_options.velocity("reverse", {
					duration: 350,
					easing: "easeOut",
					queue: false
				}).velocity("slideUp",{
					duration: 200
				});
				$srch_close.velocity("fadeOut", {
					duration: 200,
					easing: "easeOut",
					queue: false
				}).velocity({
					scaleY: ["0.1", [.44, -0.5, .39, 1.01], "1"],
					scaleX: ["0.1", [.44, -0.5, .39, 1.01], "1"]
				},{
					duration: 200
				});
				$srch_column.velocity("reverse",{
					duration: 500,
					complete: function(){
						$srch_column.css("width","");
						toggle_search(focus_target)
					}
				});
			}
        };
		var toggle_search = function (focus_target){
			$(focus_target).toggleClass('search_active');
		}

        $main_search.on('focus', function(e) {
    		e.stopPropagation();
            var focus_target = $(this).attr('data-focus');
            if ($(focus_target).hasClass('search_active') === false) {
                searching(this);
            }
        });

    	$(document).on('click','body', function(e) {
            if ($('#top_nav').hasClass('search_active')) {
                if (app.click_check($('#top_nav'), e) === false
    				&& app.click_check($main_search, e) === false) {
                    searching($main_search);
                }
            }
        });

    	$srch_close.on('click', function(e){
            $('#main_logo').focus();
			e.preventDefault();
    		searching($main_search);
    	});

        //Making sure search menu clicks return themselves correctly
        $('.utility_options').on('click', function(e) {
            e.preventDefault();
                if ($(e.target).hasClass('button')) {
                    //If any of the buttons are clicked, change the active query then change the appropriate placeholder class
                    $('.search_options .button').removeClass('active');
                    $(e.target).addClass('active');
                    var placeholder_text = "Search " + $(e.target).attr('data-placeholder');
                    $main_search.attr('placeholder', placeholder_text);
					var placeholder_column = $(e.target).attr('data-column');
					$('input[name=column_filter]').val(placeholder_column);
                }
                $main_search.focus();
            e.stopPropagation();
            return false;
    	});

		//Handle the main search
		$('form[name=main_search]').submit(function(e) {
			e.preventDefault();
			var column_filter = $('input[name=column_filter]').val();
			var search_query = $('input[name=query]').val();
			if (column_filter == '') {
				window.location.assign("/search/?query="+search_query+"");
			} else if (column_filter == 'Forms' || column_filter == 'Tools'){
				window.location.assign("/search/?query="+search_query+" AND pageCategories:"+column_filter+"");
			} else {
				window.location.assign("/search/?query="+search_query+" AND col:"+column_filter+"");
			}
		});
		//Handle the policy search
		$('form[name=policy_search]').submit(function(e) {
			e.preventDefault();
			var policy_query = $('input[name=search_policies]').val();
			window.location.assign("/search/?query="+policy_query+" AND col:4");
		});
    }

});
