var dependencies = [
        'jquery',
        'general_functions'
    ];

require(dependencies, function($, gf) {

    // Add current year to copyright text
    var current_year = new Date().getFullYear();
    $('#current_year_js').html('').html(current_year);

    var footerArticleWrapper = $('#uconnect_updates_row'),
        footerArticleURL;

    // [local]
    if (gf.check_string(gf.get_origin(), 'localhost')) {
        footerArticleURL = '../homepageUpdates.json';
    // [prod]
    } else {
        footerArticleURL = '/feeds/json/homepage-updates/index.json';
    }

    // Ajax call
    $.getJSON(footerArticleURL, function(json) {

        // Check for valid JSON array
        if ($.isArray(json.homepageUpdates)) {
            // Each news-article
            $.each(json.homepageUpdates, function(i, article) {
                // Remove html from summary by placing content in hidden DOM element then remove only text
                var itemString = this.summary,
                    itemString_text_container = $('#uconnect_updates_formatter').append(itemString),
                    summary = $('#uconnect_updates_formatter').text();
                // Check for valid JSON array
                // && if news-article has keywords
                if ($.isArray(this.keywordTags) && (this.keywordTags != '')) {
                    var keyword_tags = [];
                    // format each keyword tag into <li>
                    $.each(this.keywordTags, function(i, keyword) {
                        keyword_tags += '<dd class="card_tag"><a class="tag icon" href="/search/?query=keywords:' + keyword + '">' + keyword + '</a></dd>';
                    });
                    // add each news article's html
                    footerArticleWrapper.append('<div class="column third"><article class="card box_panel card_short"><header class="card_head"><h1 class="heading card_heading"><a href="' + this.url + '" class="link_naked">' + this.title + '</a></h1></header><div class="card_body txt_small"><time class="block txt_upper txt_small color_label">' + this.date + '</time>' + summary + '</div><footer class="card_foot card_cover"><div class="card_action"><dl class="card_tags txt_small"><dt class="card_tag txt_upper color_label pad_r_quarter">Tagged</dt>' + keyword_tags + '</dl></div></footer></article></div>');
                } else {
                    footerArticleWrapper.append('<div class="column third"><article class="card box_panel card_short"><header class="card_head"><h1 class="heading card_heading"><a href="' + this.url + '" class="link_naked">' + this.title + '</a></h1></header><div class="card_body"><time class="block txt_upper txt_small color_label">' + this.date + '</time>' + summary + '</div></article></div>');
                }
                // Clear dummy text
                $('#uconnect_updates_formatter').text('');
            });
        }

    });
});
