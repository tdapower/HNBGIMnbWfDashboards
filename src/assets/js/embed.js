require(['jquery', 'magnific_init', 'general_functions'], function($) {

    var object_class = 'object_';

    //-------------------------------
    // Manage embed height // use embed width to calculate height
    //-------------------------------
    function updateEmbedHeight() {
        var embed = $('.embed'),
            embed_height = embed.attr('height'),
            embed_width = embed.width();
        // width of embed is ~75% of the container's height (~ 8.5 x 11)
        embed_height = Math.ceil( embed_width / (3 / 4) ) + 'px';
        embed.attr('height', embed_height);
    }
    
    // (re)fire height function on window resize
    $(window).resize(function() {
        updateEmbedHeight();
    });

    //-------------------------------
    // Setup embed & provide fallback for if url is not available
    //-------------------------------
    function embedSetup() {
        // initialize embed
        // setting url dynamically b/c when IE renders tab JS, the loaded object/iframe disappears
        $('.embed').each(function() {
            var embed = $(this),
                embed_classes = embed.attr('class').split(' '); // Get array of class name(s)
                embed_method = embed.data('method'),
                embed_url = embed.data('file'),
                embed_pdf_paramaters = "#toolbar=0&statusbar=1&messages=1&navpanes=0",
                embed_url_query_string = app.get_query_string('page'),
                embed_object = '',
                browser_ie = app.browser('ie');
            // console.log('embed_url: '+embed_url);

            // Iterate the class(es) & return object var
            for (var i = 0; i < embed_classes.length; i++) {
                if (embed_classes[i].indexOf(object_class) > -1) {
                    embed_object = embed_classes[i].slice(object_class.length, embed_classes[i].length);
                }
            }

            // if pdf, add pdf-centric-paramaters
            if (embed_object == 'pdf') {
                embed_url += embed_pdf_paramaters;
            }

            // Append query string argument to object src/target
            // if hash (target) is NOT present in the query string, add it
            if (embed_url_query_string != false) {
                if ( (app.check_string(window.location.hash, '#') == false) && (embed_object != 'pdf') ) {
                    embed_url += '#&page='+embed_url_query_string;
                } else {
                    embed_url += '&page='+embed_url_query_string;
                }
            }

            // Check for various methods and replace placeholder div's html
            if (embed_url.length > 0) {
                if (embed_method == 'object') {
                    if (browser_ie == true) { // If IE, serve up <object>
                        embed.replaceWith('<object width="100%" height="940px" class="embed '+object_class+embed_object+'" data="'+embed_url+'" type="application/'+embed_object+'"><embed src="'+embed_url+'" type="application/'+embed_object+'"/></object>');
                    } else { // Else serve up iframe
                        embed.replaceWith('<iframe width="100%" height="940px" class="embed '+object_class+embed_object+'" src="'+embed_url+'"></iframe>');
                    }
                } else if (embed_method == 'iframe') {
                    if (browser_ie == true) { // If IE, serve up <object>
                        embed.replaceWith('<object width="100%" height="940px" class="embed '+object_class+embed_object+'" data="'+embed_url+'" type="application/'+embed_object+'"><embed src="'+embed_url+'" type="application/'+embed_object+'"/></object>');
                    } else { // Else serve up iframe
                        embed.replaceWith('<iframe width="100%" height="940px" class="embed '+object_class+embed_object+'" src="'+embed_url+'"></iframe>');
                    }
                } else if (embed_method == 'embed') {
                    embed.replaceWith('<'+embed_method+' width="100%" height="940px" class="embed '+object_class+embed_object+'" src="'+embed_url+'"></'+embed_method+'>');
                } else {
                    embed.replaceWith('<iframe width="100%" height="940px" class="embed '+object_class+embed_object+'" src="'+embed_url+'"></iframe>');
                }
            } else {
                embed.parent().html('').append('<div class="pad center"><span class="icon icon_before color_alert" data-icon="error"></span>Document could not be loaded. <a href="mailto:uconnect@uwhealth.org?Subject=U-Connect embed Document Not Loading&body=[Page URL] ' + window.location + '">Please let us know about it.</a></div>');
            }
        });

        // set embed height
        updateEmbedHeight();
    }

    $(function() {
        // initialize embed
        // if (!$('html').hasClass('lte8')) { // don't load on lte ie8
            embedSetup();
        // }
    });    

});