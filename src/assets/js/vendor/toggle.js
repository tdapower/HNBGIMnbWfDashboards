var dependencies = [
        'jquery',
        'velocity'
    ];

define("toggle_this", dependencies, function($, velocity) {

	///////////////////////
	// Toggle function ( toggle_this() )
	///////////////////////
	// Controls toggle events/animation
	// ACCEPTS: object, target, and an optional icon array
	//
	// NOTE: preventDefault is not included in this function.
	///////////////////////

	var toggle_this = function($this, $toggle_target, $icons){
	//Give the clicked object 'active' class for styling purposes
		$this.toggleClass('active');
		//Check for existence of icons (from data-icon and data-icon-switch)
		var icon_switches = $this.attr('data-icon-switch'),
			icon_original = $this.attr('data-icon'),
        //Default animation type and timing
            anim_easing = [ease_in_back, ease_out_back, "default"],
            anim_time = [200, 200];
        //----------------------
        /////Error correction (in case variables aren't passed into function properly)
        //----------------------

        //Making sure some icons are defined
		if($icons === undefined && icon_switches !== undefined){
			$icons = icon_switches.split(" ");
		}else if($icons === undefined){
			$icons = ["",""];
		}
        //Checking if function was passed a toggle target
        if ($toggle_target === undefined){
            $toggle_target = $this.attr('data-toggle');
            if ($toggle_target === undefined){
                console.error('data-toggle is not defined for '+$this);
            }
        }
        //Check for sibling targets since this is not easily passed via html
        if ($toggle_target === 'sibling'){

            //Making sure data-sibling exists,
            //Otherwise, throw an error.
            if ($this.attr('data-sibling')!== undefined){

                //Finding the sibling target
                $toggle_target = $this.next(function(){
                    return $this.attr('data-sibling');
                });
            }else{
                console.error("data-sibling is undefined for "+$this);
            }

        }else{
            //Convert toggle-target strings into jquery objects
            if(typeof $toggle_target ==="string"){
                $toggle_target = $($toggle_target);
            }
        }


        //Checks for icons
        // If improperly defined, we'll try to fix it.
		switch($icons.length){
			case 0:
				if(icon_original !== undefined){
					var $icon_change = [icon_original, icon_original];
				}else{
					var $icon_change = ["",""];
				};
				break;
			case 1:
				var $icon_change = [$icons, $icons];
				break;
			default:
				var $icon_change = $icons;
		}





		//Checking for custom animation ease
		if($this.attr('data-anim') !== undefined){
			//Create an array for first and second easing
			anim_easing = $this.attr("data-anim").split(" ");
		}
		//Checking for custom animation timing
		if($this.attr('data-anim-time')!== undefined){
			//Create an array for first and second timing
			anim_time = $this.attr('data-anim-time').split(" ");
		}

		//Slide animation behavior

		//  determined by class of .slide_anim
		if ($this.hasClass('slide_anim') === true) {

			//Velocity lacks support for toggle animations
			// Checking for target visibility to simulate this behavior
			if ($toggle_target.is(":visible")) {
				$toggle_target.velocity("slideUp",{
					duration: anim_time[0],
					easing: anim_easing[0],
					queue: false
				})
				.addClass('inactive');

                //Squishing animation if requested
				if($toggle_target.hasClass('js_squish')){
					$toggle_target.velocity({
						scaleY: [0.1, anim_easing[0], 1]
					},{
						duration: anim_time[0]
					});
				}

				//Change data-icon to custom setting
				// This is usually the first icon, defined in data-icon
				$this.attr('data-icon', $icon_change[0]);

			} else {
				$toggle_target.velocity("slideDown",{
					duration: anim_time[1],
					easing: anim_easing[1],
					queue: false
				})
				.removeClass('inactive');
                
                //Squishing animation if requested
				if($toggle_target.hasClass('js_squish')){
					$toggle_target.velocity({
						scaleY: [1, anim_easing[1], 0.1]
					},{
						duration: anim_time[1]
					});
				}

				//Change data-icon to custom icon, if necessary
				// This is usually the inverse icon of the default
				$this.attr('data-icon', $icon_change[1]);
			}
			//If not requesting slide animation,
			//  default to fade
		} else {
			//Removing bounce from default animation
			//(creates an unwanted strobe effect with fade)
			if (anim_easing[2] === "default"){
				anim_easing = ["easeOut", "easeOut"];
			}

			if ($toggle_target.is(":visible")) {
				$toggle_target.velocity("fadeOut", anim_time[0], anim_easing[0])
				.addClass('inactive');
				$this.attr('data-icon', $icon_change[0]);
			} else {
				$toggle_target.velocity("fadeIn", anim_time[1], anim_easing[1])
				.removeClass('inactive');
				$this.attr('data-icon', $icon_change[1]);
			};
		}
	}

	return function ($this, $toggle_target, $icons){
		return toggle_this($this, $toggle_target, $icons);
	}

});

define('toggle', ['jquery', 'velocity', 'toggle_this'], function($, velocity, toggle_this) {

	//Default toggle object click handler
	//Just needs the data-toggle attribute
	$('body').on('click', '[data-toggle]', function(e) {
		//Prevent links from doing their thang
		e.preventDefault();

		//Collecting necessary data
		var toggle_target = $(this).attr('data-toggle'),
			icon_original = $(this).attr('data-icon'),
			icon_secondary = $(this).attr('data-icon-switch'),
			toggle_sibling = $(this).attr('data-sibling'),
			icon_switch = [];

		//Checking for icon-switch
		if (icon_secondary  !== undefined) {
			var toggle_icon = icon_secondary.split(" ");
		}
		else {
			if(icon_original === undefined){
				icon_original = "";
			}
			var toggle_icon = [icon_original, icon_original];
		}

		//Call toggle function
		toggle_this($(this), toggle_target, toggle_icon);
	});


///////////////////////
// Card Toggles
///////////////////////

	var cd_tag_width = [],
		cd_width,
		cd_width_diff;

	//Difference Function
	function cd_diff(a,b){return Math.abs(a-b);}

	$('.card_tags').each(function(i){
		cd_tag_width = $(this).width();
		cd_width = $(this).parent().width();
		cd_width_diff = cd_diff(cd_width, cd_tag_width);

		if ( cd_width_diff <= 40 ){
			$(this).addClass('pad_r').before('<a class="icon icon_before js_tags_toggle js_no_click card_tags_toggle" data-icon="&#xe62a">&nbsp;</a>');
		};

	});

	var $cd_target, auto_height;

	$('body').on('click','.js_tags_toggle', function(){

		$cd_target = $(this).next('.card_tags');
		auto_height = $cd_target[0].scrollHeight;

		$(this).toggleClass('active');

		auto_height = auto_height + "px";
		if(!$cd_target.hasClass('open')){

			$cd_target.addClass('open')
			.velocity({
				height: [auto_height,[300, 20], "3rem"]
			},{
				duration: 300,
			}).css("height", "auto");

		}else{
			$cd_target.removeClass('open')
			.velocity({
				height: ["3rem",[300, 22]]
			},{
				duration: 200,
			});
		}

	});
});
