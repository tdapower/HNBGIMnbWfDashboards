var dependencies = [
        'jquery',
        'general_functions',
        'toggle'
    ];

require(dependencies, function($, gf, toggles) {

$(function() {
	////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Setup various elements w/ accordion + icon classes
    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    var accordion_classes = 'accordion icon icon_right';
	var accordion_object = '<a class="slide_anim icon icon_before accordion_trigger" data-icon="&#xe64d" data-icon-switch="&#xe64d &#xe64e" data-toggle="sibling" data-sibling="ul">&nbsp;</a>'

	// Setup elements that need accordion added
	//	$(".has_children").addClass(accordion_classes);

    // Check for .build_flat_accordion (Children Tree Widget)
	var headname = 'accordion_tree_head',
		headclass = '.'+headname,
		$headobj = $(headclass);

	$('.js_flat_accordion').each(function(i){
		var $this = $(this),
			target_number = [];

		//Remove bullets
		$this.find('ul').addClass('list_naked');
		//Remove link decoration
		$this.find('a').addClass('link_naked');
		//Prepare for gridification
		$this.addClass('row');
		//Make first level a header

		if(!$this.hasClass('js_no_headings')){
			$this.find('.list_child_tree > ul > li').addClass('accordion_tree');
			$this.find('.accordion_tree > a').addClass(headname + ' heading');

			//Add a row to the second level with unique IDs
			// Will be Targeted later
			$('.accordion_tree > ul').has('li').each(function(j){
				$(this).wrap('<div id="target_'+j+'" class="accordion_target row"/>');
				target_number.push(j);
			});
			//Add accordion buttons to headings, targeting the sibling row's ID
			var no_target = 0;
			$this.find(headclass).each(function(k){
				if ($(this).next().hasClass('row')){
					//Compensate iterator(k) for missing targets
					k = k - no_target;
					$(this).after('<a class="accordion_trigger icon icon_before slide_anim" data-icon="&#xe62a" data-anim="easeOutCirc easeInCirc" data-anim-time="220ms 250ms" data-toggle="#target_'+k+'" data-icon-switch="&#xe629 &#xe62a">&nbsp;</a>');
				}else{
					//Make a note of a missing child target
					no_target++;
				}
			});

			//Make second level into boxes with overflow hidden
			//and divide into half columns
			var $find_boxes = $('.accordion_tree .row > ul > li');

			$find_boxes.addClass('box space_b_half box_small box_panel o_hide')
				.wrap('<div class="column half small_full"/>');
				//Add accordion wrapper
				$find_boxes.has('ul').wrapInner('<div class="accordion accordion_split accordion_bordered js_accordion_open"></div>');
			//Style second level header
			$this.find('.accordion_split > a').addClass('sub_heading space_n_b')
			//Insert accordion trigger button
			.after('<a class="active accordion_trigger icon icon_before slide_anim" data-icon="&#xe64e" data-toggle="sibling" data-sibling=".accordion_target" data-icon-switch="&#xe64d &#xe64e">&nbsp;</a>');

			//Add accordion target styling
			$this.find('.accordion_split > ul').addClass('pad_t_half pad_r_2 accordion_target');

            $('.list_child_tree').removeClass('list_child_tree');
		}
	});


	// Sidenav
    $("#sidebar li").has('ul').addClass('accordion_split')
	.find('> a, > span').after(accordion_object);
	$('#sidebar .accordion_split ul').addClass('accordion_target js_squish');

    require(['toggle_this'], function(toggle_this){
        $('#sidebar .accordion_trigger').each(function(){
            if( !$(this).next('ul').has('.currentbranch0')
               || !$(this).prev().hasClass('currentbranch0')){
                toggle_this($('#sidebar .accordion_trigger'));
            }
        });
    });

    // Initialize accordions
    require(['accordion_init']);

});

});
