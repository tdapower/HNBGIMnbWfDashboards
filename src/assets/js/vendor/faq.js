var dependencies = [
        'jquery',
        'toggle'
    ];

require(dependencies, function($, toggles) {

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    // FAQ
    ////////////////////////////////////////////////////////////////////////////////////////////////////////

	var faq_trigger = '<div class="slide_anim icon icon_before accordion_trigger" data-icon="&#xe64d" data-icon-switch="&#xe64e &#xe64d">&nbsp;</div>';
	var faq_targets = [],
		answer_target;

	var faq_wrap = function($this, i){
		answer_target = '#js_answer_'+i;
		//Wrap FAQs in
		$this.addClass('faq_question slide_anim icon icon_before accordion_trigger')
			.attr('data-icon-switch','&#xe64e &#xe64d')
			.attr('data-anim','easeIn easeOut')
			.nextUntil("#faq h1")
			.andSelf()
			.wrapAll('<section class="faq accordion_split"/>');
		//Wrap FAQ answer in the target.
		$this.nextAll().wrapAll('<div id="js_answer_'+i+'" class="accordion_target faq_answer"/>');

		var target_temp = $(answer_target);
		faq_targets.push(target_temp[0]);
		$this.attr('data-toggle', answer_target);
	}

    $('#faq h1').each(function(i) {
		faq_wrap($(this), i);
    });

	$(function(){
		//Hide FAQ answers.
		$(faq_targets).hide();
	});

});
