var dependencies = [
        'jquery',
        'general_functions'
    ];

require(dependencies, function($, gf) {

    function sortDataDate(a, b) {
        return ($(b).data('date')) > ($(a).data('date')) ? 1 : -1; 
    }

    function sortDataIndex(a, b) {
        return ($(b).data('index')) < ($(a).data('index')) ? 1 : -1; 
    }

    // ------------------------------------------------
    // Homepage "Feed"
    // ------------------------------------------------
    // Wide features (via hbs) & feed articles (via SearchBlox RSS) sources are combined 
    // ------------------------------------------------
    // component/feature-wide.hbs
    // ------------------------------------------------
    // (1) featureWide_setDate() = Format date
    //      (a) create data-date (to be sorted)
    //      (b) reformat date 
    // (2) featureWide_sortDate() = Sort data-date (descending)
    // (3) featureWide_setIndex() = set data-index 
    //      (a) "X" in pattern: 1, 2, X, 4, 5, 6, X, 7, 8, 10, X, 12, 13, 14, X...
    //          (i) "X" = components/feature-wide.hbs
    // ------------------------------------------------
    // SearchBlox RSS Feed/Collection
    // ------------------------------------------------
    // (4) feed_buildUrl() = Get number of feeds to return from SearchBlox collection && build URL to retrieve SearchBlox collection
    // (5) getSearchbloxJSON() = Get feed
    // (6) parseSearchbloxJSON() = Parse necessary feed info
    //      (a) Remove unnecessary HTML in "summary": output data to DOM container, use .text() to strip html, clear container
    //      (b) feed_setCardCol() = Set feed (.card) column width
    //      (c) format_month() = Format date
    //      (d) feed_checkSource() = Check source of article
    //      (e) feed_getArticleImg() = Return article img (if available) & change protocol
    // (7) feed_buildHtml() = Format RSS data to (.card) html
    // (8) feed_setIndex() = Set data-index
    //      (a) "X" in pattern: X, X, 3, X, X, X, 7, X, X, X, 11, X, X, X, 15...
    //          (i) "X" = SearchBlox feed article
    // ------------------------------------------------
    // Combined
    // ------------------------------------------------
    // (9) setOutputPattern() = Combine and sort featureWide & SearchBlox article

    var featureWide_index = 0,
        featureWide_max = 6,
        featureWide_indexInterval = 3,
        html_index = 0,
        feed_total = 0,
        featureWide_indexArray = [],
        featureWide = $('#feature_wide_container .sort'),
        outputContainer = $('#feeds_modified'),
        feed_url,
        feed_checkUrl;

    // Add loading spinner
    outputContainer.addClass('loading', '100');

    // ------------------------------------------------
    // Format date
    // ------------------------------------------------
    function featureWide_setDate() {
        $.each((featureWide), function() {
            var dateContainer = $(this).find('time'),
                displayDate = dateContainer.text(),
                dateDate = new Date(displayDate).valueOf(),
                date = new Date(displayDate),
                dateMonth = gf.format_month(date.getMonth()),
                dateDay = date.getDate();
            // Set data-date, to be sorted
            $(this).attr('data-date', dateDate);
            // Format date as MMM d
            dateContainer.text('').text(dateMonth + ' ' + dateDay);
        });
        featureWide_sortDate();
    }

    // ------------------------------------------------
    // Sort data-date
    // ------------------------------------------------
    function featureWide_sortDate() {
        featureWide.sort(sortDataDate).appendTo('#feature_wide_container');
        featureWide_setIndex();
    }

    // ------------------------------------------------
    // Sort data-index
    // ------------------------------------------------
    function featureWide_setIndex() {
        var featureWide_data_index;
        $.each((featureWide), function(i) {
            // Count each feature
            featureWide_index++;
            // console.log('featureWide_index: '+featureWide_index);
            // Apply data-index
            if (featureWide_index > featureWide_max) {
                $(this).addClass('hidden');
            }
            if (featureWide_index == 1) {
                featureWide_data_index = featureWide_index * featureWide_indexInterval;
            } else {
                featureWide_data_index = (featureWide_index * featureWide_indexInterval) + i;
            }
            $(this).attr('data-index', featureWide_data_index);
            // Push data-index to indexes array
            featureWide_indexArray.push(featureWide_data_index);
        });
        // console.log('featureWide_indexArray: '+featureWide_indexArray);
        feed_buildUrl();
    }

    // ------------------------------------------------
    // Get number of feeds to return from SearchBlox collection
    // & build URL to retrieve SearchBlox collection
    // ------------------------------------------------
    function feed_buildUrl() {
        // Setup feed_total
        feed_total = 26 - featureWide_max;
        // [local]
        if (gf.check_string(gf.get_origin(), 'localhost')) {
            feed_url = '/searchbloxUpdates.json';
        // [prod]
        } else {
            feed_total = '&pagesize=' + feed_total;
            feed_url = '/searchblox/servlet/SearchServlet?col=16&query=*&sort=lastmodified' + feed_total;
        }          
        // gather results
        getSearchbloxJSON(feed_total, parseSearchbloxJSON);
        // console.log('feed_total: '+feed_total);
    }

    // ------------------------------------------------
    // Get feed
    // ------------------------------------------------
    function getSearchbloxJSON(feed_total, callback) {
        $.ajax({
            url: feed_url, // encodeURIComponent(url),
            dataType: 'json', // 'jsonp'
            success: function(data) {
                callback(data.results);
            },
            error: function () {}
        });
    }

    // ------------------------------------------------
    // Return article img (if available) & change protocol
    // ------------------------------------------------
    function feed_getArticleImg(element) {
        var img_src = element.find('img:eq(0)').attr('src');
        // console.log('img_src: '+img_src);
        if (img_src === undefined) {
            img_src == '../../img/bg/pat_bubble_large.png';
        } else {
            // http://www.uwhealth.orghttp//med.wisc.edu/files/smph/images/news_events/generic_thumbs/img-smph-crest-thumb.jpg
            if (img_src.search('http://www.uwhealth.orghttp') >= 0) {
                img_src = img_src.replace('http://www.uwhealth.orghttp', 'https');
            } else {
                img_src = img_src.replace('http://www.uwhealth.org', 'https://www.uwhealth.org');
            }
        }
        // console.log('img_src: '+img_src);
        return img_src;
    }

    // ------------------------------------------------
    // Check feed source
    // ------------------------------------------------
    function feed_checkSource(source) {
        if (gf.check_string(source, 'uwsmph')) {
            return 'med.wisc.edu';
        } else if (gf.check_string(source, 'uwhealth')) {
            return 'uwhealth.org';
        } else {
            return 'U-Connect';
        }
    }

    // ------------------------------------------------
    // Set feed (.card) column width
    // ------------------------------------------------
    function feed_setCardCol(i) {
        if (i <= 1) {
            return 'half';
        } else {
            return 'third';
        }
    }

    // ------------------------------------------------
    // Parse necessary feed info
    // ------------------------------------------------
    function parseSearchbloxJSON(feed_response) {
        $.each((feed_response.result), function(i) {
            var itemString = feed_response.result[i].description,
                itemString_text_container = $('#feeds_formatter').append(itemString),
                html_col_type = feed_setCardCol(i),
                summary = '<p>' + $('#feeds_formatter').text() + '</p>',
                date = gf.format_date(feed_response.result[i].indexdate),
                dateMonth = date.month,
                dateDay = date.day,
                title = feed_response.result[i].title,
                link = feed_response.result[i].url,
                image = feed_getArticleImg($('#feeds_formatter')),
                source = feed_checkSource(link),
                action_text = 'Read More',
                content_type = 'News'; // 'Page Update'
            // console.log('displayDate: '+displayDate);
            // console.log('date: '+date);
            // console.log('displayDate.getMonth(): '+displayDate.getMonth());
            // console.log('dateMonth: '+dateMonth);
            // console.log('dateDay: '+dateDay);
            // Build html
            feed_buildHtml(html_col_type, link, image, content_type, title, summary, source, date, dateMonth, dateDay, action_text);
            // Clear dummy text
            $('#feeds_formatter').text('');
        });
        feed_setIndex()
    }

    // ------------------------------------------------
    // Format RSS data to (.card) html
    // ------------------------------------------------
    function feed_buildHtml(html_col_type, link, image, content_type, title, summary, source, date, dateMonth, dateDay, action_text) {
        var html_card = '<div class="column '+html_col_type+' sort smalls_pad_n" data-date="'+date+'">' + // data-index="'+html_index+'"
                            '<a href="'+link+'" class="link_naked card_expand">' +
                                '<article class="card box_panel">' +
                                    '<header class="card_media" style="background-image: url(\''+image+'\');">' +
                                        '<label class="sub_heading card_label card_bottom color_white card_cover_dark">' +
                                            content_type +
                                        '</label>' +
                                    '</header>' +
                                    '<section class="card_body">' +
                                        '<h1 class="heading card_heading">' +
                                            title +
                                        '</h1>' +
                                        '<div class="txt_small">' +
                                            summary +
                                        '</div>' +
                                    '</section>' +
                                    '<footer class="card_foot card_cover txt_small">' +
                                        '<div class="card_info color_label">' +
                                            source +
                                            '<time class="float_right block clearfix txt_upper">' +
                                                dateMonth + ' ' + dateDay +
                                            '</time>' +
                                        '</div>' +
                                        '<div class="card_action">' +
                                            '<strong class="icon icon_after icon_absolute icon_absolute_right block" data-icon-after="triangle right">' +
                                                action_text +
                                            '</strong>' +
                                        '</div>' +
                                    '</footer>' +
                                '</article>' +
                            '</a>' +
                        '</div>';
        $('#feeds').append(html_card);
    }

    // ------------------------------------------------
    // Set data-index
    // ------------------------------------------------
    function feed_setIndex() {
        var feed = $('#feeds .sort'),
            feed_index;
        $.each((feed), function(i) {
            feed_index++;
            // Define the first three article's indexes manually 
            if (i == 0) {
                feed_index = 1;
            } else if (i == 1) {
                feed_index = 2;
            } else if (i == 2) {
                feed_index = 4;
            } else {
                // if feed_index matched a featureWide index, skip it
                if ($.inArray(feed_index, featureWide_indexArray) !== -1) {
                    feed_index++;
                }
            }
            $(this).attr('data-index', feed_index);
        });

        setOutputPattern();
    }

    // ------------------------------------------------
    // Combine and sort featureWide & SearchBlox article
    // ------------------------------------------------
    function setOutputPattern() {
        var elements_before_move = $('#feeds_container .sort');
        elements_before_move.sort(sortDataIndex).appendTo(outputContainer);
        // Remove loading spinner
        outputContainer.removeClass('loading', '100');
    }

    $(document).ready(function() {
        featureWide_setDate();
        // setOutputPattern();
    });    

});