var dependencies = [
        'jquery'
    ];

define(dependencies, function($) {

    return {

        // ------------------------------------------------
        // Get window.location.origin
        // ------------------------------------------------
        get_origin: (function() {
            if (!window.location.origin) {
                window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
            }
            return window.location.origin;
        }),
        
        // ------------------------------------------------
        // Check string for specific variable
        // ------------------------------------------------
        check_string: (function(string, variable) {
            if (string.indexOf(variable) > -1 ) {
                return true;
            } else {
                return false;
            }
        }),

        // ------------------------------------------------
        // Parse URL query string: check for "?" (true/false)
        // ------------------------------------------------
        get_query_string: (function(variable) {
            var query = window.location.hash.substring(1);
            var vars = query.split("?");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if (pair[0] == variable) {
                    return pair[1];
                }
            }
            return false;
        }),

        // ------------------------------------------------
        // Parse string for file extension
        // ------------------------------------------------
        get_extension: (function(variable) {
            var extension = variable.substr( (variable.lastIndexOf('.') +1) );
            return extension;
        }),

        // ------------------------------------------------
        // Check browser via class(es) on <html> tag
        // ------------------------------------------------
        check_browser: (function(variable) {
            if ( $('html').hasClass(variable) ) {
                return true;
            } else {
                return false;
            }
        }),

        // ------------------------------------------------
        // Check clicked element against its container
        // ------------------------------------------------
        check_click: (function(container, event) {
            if (!container.is(event.target) // if the target of the click isn't the container
                && container.has(event.target).length === 0) {
                return false;
            } else {
                return true;
            }
        }),

        // ------------------------------------------------
        // Format month
        // ------------------------------------------------
        format_month: (function(variable) {
            var month = variable + 1;
            switch(month) {
                case 1:
                case 'january':
                case 'jan':
                case 'Jan':
                    return 'JAN';
                break;
                case 2:
                case 'february':
                case 'feb':
                case 'Feb':
                    return 'FEB';
                break;
                case 3:
                case 'march':
                case 'mar':
                case 'Mar':
                    return 'MAR';
                break;
                case 4:
                case 'april':
                case 'apr':
                case 'Apr':
                    return 'APR';
                break;
                case 5:
                case 'may':
                case 'May':
                    return 'MAY';
                break;
                case 6:
                case 'june':
                case 'jun':
                case 'Jun':
                    return 'JUN';
                break;
                case 7:
                case 'july':
                case 'jul':
                case 'Jul':
                    return 'JUL';
                break;
                case 8:
                case 'august':
                case 'aug':
                case 'Aug':
                    return 'AUG';
                break;
                case 9:
                case 'september':
                case 'sep':
                case 'Sep':
                    return 'SEP';
                break;
                case 10:
                case 'october':
                case 'oct':
                case 'Oct':
                    return 'OCT';
                break;
                case 11:
                case 'november':
                case 'nov':
                case 'Nov':
                    return 'NOV';
                break;
                case 12:
                case 'december':
                case 'dec':
                case 'Dec':
                    return 'DEC';
                break;
            }
        }),

        // ------------------------------------------------
        // Format date
        // ------------------------------------------------
        format_date: (function(variable) {
            var displayDate = new Date(variable),
                date = new Date(displayDate).valueOf(),
                dateMonth = require('general_functions').format_month(displayDate.getMonth()),
                dateDay = displayDate.getDate();
            return {
                month: dateMonth,
                day: dateDay
            };
        }),

        // ------------------------------------------------
        // Check current template,  #check_template
        // ------------------------------------------------
        check_template: (function() {
            if ($('#check_template').index() >= 0) {
                var template = $.trim(check_template.text());
                window.template = template;
            } else {
                window.template = '';
            }
        }),

        // ------------------------------------------------
        // Check label(s),  #check_label, return HC/MF/UW Health
        // ------------------------------------------------
        check_label: (function() {
            if ($('#check_label').index() >= 0) {
                var check_label = $('#check_label span');
                // if only one label, use it
                if (check_label.length == '1') {
                    window.labels = check_label.text();
                } else { // if > 1 label, default to UW Health
                    window.labels = "UW Health";
                }
            } else {
                window.labels = '';
            }
        }),

        // ------------------------------------------------
        // Check current media query
        // #check_mq:before content specified in _app.scss, retrieve content via JS
        // [NOTE] IE<=8 does not support retrieving pseudo content and does not work
        // ------------------------------------------------
        // Global check_mq function
        check_mq: function() {

            // This if statement will catch errors for old browsers and return null, rather than failing
            if (!window.getComputedStyle) {
                window.getComputedStyle = function(el, pseudo) {
                    this.el = el;
                    this.getPropertyValue = function(prop) {
                        var re = /(\-([a-z]){1})/g;
                        if (prop == 'float') prop = 'styleFloat';
                        if (re.test(prop)) {
                            prop = prop.replace(re, function() {
                                return arguments[2].toUpperCase();
                            });
                        }
                        return el.currentStyle[prop] ? el.currentStyle[prop] : null;
                    }
                    return this;
                }
            }

            var mq = getComputedStyle(document.querySelector('#check_mq'), "::before").getPropertyValue("content");
            window.mq = mq; // update global var
            return mq;

            $(function() {
                // Fire media-query-check on load
                check_mq();
            });

            $(window).resize(function() {
                // media-query-check on window resize
                check_mq();
            });

        },

        // ------------------------------------------------
        // Check DOM for specific element
        // ------------------------------------------------
        element_exists: (function(element) {
            if (element.index() >= 0) {
                return true;
            } else {
                return false;
            }
        })

    };

});