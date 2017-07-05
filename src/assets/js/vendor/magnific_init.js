var dependencies = [
        'jquery',
        'magnific'
    ];

require(dependencies, function($) {
	
	if (!$('html').hasClass('lte-ie8')) {

		var clickedLink,
			embed_type;

		function mfp_close_any() {
			window.top.eval('$.magnificPopup.close()');
		}

	    $('.magnific_popup').magnificPopup();
		
		$('.magnific_popup_iframe').click(function(){
			clickedLink = $(this).attr('id');
		}).magnificPopup({
			type: 'iframe', // embed_type,
			midClick : true,
			mainClass : 'mfp-zoom-out-cur',
			focus : $('#loginform input#user'),
			callbacks : {
				// Show magnific loading while waiting for iframes
				// https://stackoverflow.com/questions/21259424/magnific-popup-iframe-how-to-show-that-the-iframe-is-loading
				beforeAppend : function() {
					var curLength = 0;
					var interval = setInterval(
						function() {
							if ($('iframe').length !== curLength) {
								curLength = $('.column-header').length;
								$('.mfp-content').hide();
								$('.mfp-preloader').show();
							}
						}, 50);
					this.content.find('iframe').on('load',function() {
						clearInterval(interval);
						$('.mfp-content').show();
						$('.mfp-preloader').hide();
					});
				},
				/*
				 * ----------------------
				 * CAS + Magnific Summary
				 * ---------------------- 
				 * - will not load on IE8; instead users are sent directly to CAS (*look to else-statement below where CAS target is getting applied), then return to page
				 * - all lightbox triggers have .fancyform class; on click, the id is passed to clickedLink var serving to distinguish which login btn clicked (login, hi-5, update profile, add to group)
				 *  - When magnific opens, a very short timeout function continually checks for the iframe CAS header text to change
				 *  - After "Log In Successful": 
				 *  	- for login btn: reload page
				 */
				open : function() {
					$('.mfp-iframe').load(function() {
						var iframe_header = $('.mfp-iframe').contents().find('#content .container__page_title h2').text();
						setTimeout(function() {
							// [LOGIN] <h2> = "Log In Successful"
							if (iframe_header == "Log In Successful") {
								if (clickedLink == 'loginlink') {
									// [source] "Login"
									mfp_close_any();
									location.reload();
								} else {
									$.post(
										'/login/cas',
										function() {
											// Close modal and continue to magnific-close callback
											mfp_close_any();
										}
									);
								}
							}
						}, 5);
					});
				},
				close : function() {
					$.post('/directory/login/cas', {
						"user" : $("#user").val(),
						"type" : "json"
					},
					function(data) {
						if (data.status == "1") {

						} else if ((data.status == "2") || (data.status == "0")) {
							var url = "/directory/error.jsp";
							$(location).attr('href', url);
						}
					});
				}
			}
		});
	} else {
		$("#hi5loginlink, #profileloginlink, #loginlink, #grouploginlink").each(function() {
			var url_host = (window.location.host).toLowerCase(),
				url_original = $(this).attr('href'),
				cas_environment;
			if ( (url_host.indexOf('local') >= 0) || (url_host.indexOf('dev') >= 0) ) {
				cas_environment = 'dev.';
			} else if (url_host.indexOf('staging') >= 0) {
				cas_environment = 'staging.';
			} else {
				cas_environment = 'n.';
			}			
			$(this).attr('href', url_original + '?TARGET=https%3A%2F%2F' + cas_environment + 'uconnect.wisc.edu');
		});
	}


	// if (!$('html').hasClass('lte8')) { // don't load on lte ie8

	// 	var clickedLink,
	// 		embed_type;

	//     $('.magnific_popup').magnificPopup();

	//     $('.magnific_popup_iframe').click(function(){
	// 		clickedLink = $(this).attr('id');
	// 	}).magnificPopup({
	//         type: 'iframe', // embed_type,
	//         midClick: true,
	//         focus: $('#username'),
	//   	    callbacks: {
	// 			beforeAppend: showIframeLoading,
	// 		    open: function () {
	// 		    	if ( (clickedLink == 'loginlink') || (clickedLink == 'logoutlink') ) {
	// 		    		$('.mfp-iframe').load(function() {
	// 		    			var iframe_url = $(".mfp-iframe").get(0).contentWindow.location.toString();
	// 		    			setTimeout(function(){
	// 		    				// Log in
	// 	    					// if iframe url is not logout and clicked link is login
	// 			    			if ( (iframe_url.indexOf('cas/logout') == -1) && (clickedLink == 'loginlink') ){
	// 				    			// if header <h2> = "Log In Successful"
	// 				    			if ($('.mfp-iframe').contents().find('#content .container__page_title h2').text() == "Log In Successful") {
	// 					    			location.reload();
	// 				    			}
	// 				    		// Log out
	// 				    		// if iframe url is logout and clicked link is logout
	// 				    		} else if ( (iframe_url.indexOf('cas/logout') != -1) && (clickedLink != 'logoutlink') ){
	// 				    			mfp_close_any();
	// 				    		}
	// 		    			}, 5);
	// 		    		});
	// 		    	}
	// 		    }
	// 		}
	//     });

	// 	function mfp_close_any() {
	// 		window.top.eval('$.magnificPopup.close()');
	// 	}
		
	// 	// Show magnific loading while waiting for iframes
	// 	// https://stackoverflow.com/questions/21259424/magnific-popup-iframe-how-to-show-that-the-iframe-is-loading
	// 	var showIframeLoading = function() {
	// 	    var curLength = 0;
	// 	    var interval = setInterval(function() {
	// 	        if ($('iframe').length !== curLength) {
	// 	            curLength = $('.element_no_exist').length;
	// 	            $('.mfp-content').hide();
	// 	            $('.mfp-preloader').show();
	// 	        }
	// 	    }, 50);
	// 	    this.content.find('iframe').on('load', function() {
	// 	        clearInterval(interval);
	// 	        $('.mfp-content').show();
	// 	        $('.mfp-preloader').hide();
	// 	    });
	// 	};

	// }

});