// require(['jquery', 'jbreadcrumb', 'hover_intent'], function($) {

//     //////////////////////////////////////////////////////////////////////////
//     // Header
//     //////////////////////////////////////////////////////////////////////////
//     // function hide_last_breadcrumb_head() {
//     //     var crumb_list = $('.img_header .breadcrumbs'),
//     //         crumb_last = crumb_list.find('li').last();
//     //     // Hide last breadcrumb
//     //     crumb_last.hide();
//     // }
//     // hide_last_breadcrumb_head();

//     //////////////////////////////////////////////////////////////////////////
//     // Footer
//     //////////////////////////////////////////////////////////////////////////
//     // function hide_last_breadcrumb_footer() {
//     //     var crumb_list = $('.footer .breadcrumbs'),
//     //         crumb_last = crumb_list.find('li:not(".current_page")').last();
//     //     // Hide last breadcrumb
//     //     crumb_last.hide();
//     // }
//     // hide_last_breadcrumb_footer();

//     // (Re)initialize plugin
//     function jbreadcrumb_init() {
//         // Don't implement jBreadCrumb if on small-mq(s)
//         if ((mq != 'small') && (mq != 'smalls') && (mq != 'smallish')) {
//             var crumb_list = $('.footer .breadcrumbs'),
//                 crumb_list_width = crumb_list.width(),
//                 crumb_list_items_width = 0;
//             crumb_list.children('li').each(function(i, e) {
//                 crumb_list_items_width += $(e).outerWidth();
//             });
//             // if crumbs are wider then the container, initialize
//             if (crumb_list_items_width >= crumb_list_width) {
//                 // Add style plugin
//                 crumb_list.addClass('has_ellipse');
//                 // Initialize plugin
//                 crumb_list.jBreadCrumb();
//                 // Initialize hoverIntent
//                 setup_footer_breadcrumb_hoverIntent();
//             }
//             // Set max width
//             jbreadcrumb_reset_maxWidth();
//         }
//     }
//     jbreadcrumb_init();

//     // Set/Reset jbreadcrumb max width on page load && screen width change
//     function jbreadcrumb_reset_maxWidth() {
//         var crumb_list = $('.footer .breadcrumbs');
//         // Initialize plugin if has not already happened
//         if (!crumb_list.hasClass('has_ellipse')) {        
//             // Don't implement jBreadCrumb if on small-mq
//             if ((mq != 'small') && (mq != 'smalls') && (mq != 'smallish')) {
//                 // Find width and send to plugin
//                 var crumb_list = $('.footer .breadcrumbs'),
//                     crumb_list_width = crumb_list.width();
//                 jQuery.fn.jBreadCrumb.defaults = {
//                     maxFinalElementLength: crumb_list_width
//                 }
//             }
//         } else {
//             /* TO DO */
//             // Add destroy method to jbreadcrumb plugin
//             jbreadcrumb_init();
//         }
//     }
//     $(window).resize(function() {
//         jbreadcrumb_reset_maxWidth();
//     });

//     // Setup bkgnd img swap on hover
//     function setup_footer_breadcrumb_hoverIntent() {
//         // Setup hoverIntent
//         $('.footer .breadcrumbs li').hoverIntent(function() {
//             $(this).find('.breadcrumb_ellipse').stop().animate({
//                 opacity: 0
//             }, 0, function() {
//                 $(this).css({
//                     'background': 'url("../cosmos/uconnect/img/breadcrumb.png") no-repeat 100% 2px',
//                     'width': '14px',
//                     'top': '13px'
//                 });
//             }).animate({
//                 opacity: 1
//             }, 0);
//         }, function() {
//             $(this).find('.breadcrumb_ellipse').stop().animate({
//                 opacity: 0
//             }, 0, function() {
//                 $(this).css({
//                     'background': 'url("../cosmos/uconnect/img/breadcrumb_ellipse.png") no-repeat 0px 0px',
//                     'width': '30px',
//                     'top': '14px'
//                 });
//             }).animate({
//                 opacity: 1
//             }, 0);
//         });
//     }

// });