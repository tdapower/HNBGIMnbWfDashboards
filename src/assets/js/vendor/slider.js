require(['jquery'], function($) {

	$(function(){
		if (!$('html').hasClass('lte8')) { // don't load on lte ie8

		    var $slides = $('.slide');


		    if ($slides.length > 1) {

				require(['slick'], function(slick){

					$slides.wrapAll("<div id='slider' class='slider'></div>");

					var $slider = $('#slider'),
						overflow = 'o_hide';

					if ($('html').hasClass('ie9')){
						$slider.slick({
								dots: true,
								infinite: true,
								speed: 250,
								slidesToShow: 1,
								autoplaySpeed: 15000,
								slide: '.slide',
								cssEase: 'ease-out',
								arrows: true,
								draggable: false,
								useCSS: false
							});
					}else{
						$slider.slick({
							dots: true,
							infinite: true,
							speed: 500,
							slidesToShow: 1,
							autoplaySpeed: 15000,
							slide: '.slide',
							cssEase: 'cubic-bezier(.65, 1.45, .65, .91)',
							arrows: true,
							swipe: true,
							draggable: false
					    });
					}
					//Removes class that hides secondary slides.
					// This is initially applied to remove jarring bounce
					// the page has before slick is initialized.
					$('.slide').removeClass('unslicked');
				});
			}
		}
	});

});
