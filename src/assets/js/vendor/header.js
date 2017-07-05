require(['jquery', 'velocity'], function($) {

	if (!$('html').hasClass('lte8')) { // don't load on lte ie8

	    //-------------------------------
	    // Header left (larger) icon
	    //-------------------------------
		var $icon_container = $('#flair_icon_js'),
			$header_icon = $icon_container.find('#header_icon_js');

	    var update_header_icon = function() {
	        if (!$icon_container.has('#flair_js').length){
				$icon_container.addClass('o_show');
			}else{
				$header_icon.hide();
			}
	    }
	    // Check DOM for #header_icon
	    if ($header_icon.index() >= 0) {
	        update_header_icon();
	    }

		//-------------------------------
		// Overview and tagbar behavior
		//-------------------------------
		var $overview = $('#overview'),
			$tagbar = $('#tag_bar'),
			overview_height = 0,
			$button_reveal = $('#reveal_header'),
			//Mass toggling of targets
			header_classes = function(targets, classes){
				$(targets).toggleClass(classes);
			}
		if($overview[0] !== undefined){
			//Using the height of all children in overview for measurement.
			//ScrollHeight cannot be used because of it typically
			//over-estimates the height.
			$overview.children().each(function(){
				overview_height = overview_height + $(this)[0].clientHeight;
			});
		}

		//OVERVIEW and TAGBAR have mask ON by default.
		//Check the overview height
		if ( overview_height > 100 && $overview !== undefined ){
			//If it's larger than 100px, we make it revealable.
			$button_reveal.removeClass('hidden');
			//We then use scrollHeight for animations since it gives
			//a better height for animation purposes.
			overview_height = $overview[0].scrollHeight;
			tag_bar_height = $tagbar[0].scrollHeight;
		}else{
			//If the overview is smaller than 100px, we'll remove the mask.
			$overview.removeClass('mask');
			if ($('#tag_bar .wide_content').children().length >= 1){
				//Before removing the mask from the tagbar,
				// we check to see if it has any children.
				$tagbar.removeClass('mask');
			}
		};

		$('body').on('click', '#reveal_header', function(){
			//Animate the overview, the button, and the tag bar
			// 1. Reveal the overview (bounce down).
			// 2. Flip the button roughly when the overview bounces
			// 3. Reveal the tagbar after the button bounces by swinging it in.
			if($overview.hasClass('mask')){
				//[1]
				$overview.velocity({
					maxHeight: [overview_height, [375, 18], '3.75rem']
				},{
					duration: 550
				}, {
					begin: header_classes('#reveal_header','clicked'),
					complete: header_classes('#overview, #tag_bar', 'mask')
				});
				//[2]
				$button_reveal.velocity({
					scaleY: [-1, "easeOutCirc", 1],
					'padding-bottom': ["0px", [.42, 0, .71, 1.26]]
				},{
					duration: 400,
					delay: 120
				});
				//Make sure the tagbar is set to 0 height before starting the animation.
				$tagbar.css('max-height', '0');
				//[3]
				$tagbar.velocity({
					scaleY: [1, ease_out_back, 0],
					maxHeight: [tag_bar_height, "easeOutExpo", 0]
				},{
					delay: 350,
					duration: 350
				});
			}else{
				$('#reveal_header, #tag_bar').velocity("reverse",{
					duration: 330
				});
				$overview.velocity(
					"reverse",
				{
					duration: 300
				},{
					begin: header_classes('#reveal_header','clicked'),
					complete: header_classes('#overview, #tag_bar', 'mask')
				});
			}
		});

	}

});
