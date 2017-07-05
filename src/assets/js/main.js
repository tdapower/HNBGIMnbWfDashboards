'use strict';

// ------------------------------------------------
// jQuery declaration
// ------------------------------------------------
// Detecting IE // https://stackoverflow.com/questions/15213439/picking-jquery-1-9-or-2-0-using-javascript-and-require-js
var pathToJQuery;
if ('querySelector' in document && 'localStorage' in window && 'addEventListener' in window) {
    pathToJQuery = [
        '//ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min',
        '../../js/vendor/jquery' // fallback if CDN fails
    ]
} else {
    // IE 6-8 fallback, use jQuery version 1.x
    pathToJQuery = [
        '//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min',
        '../../js/vendor/jquery.1.11.0.min' // fallback if CDN fails
    ]
}

// ------------------------------------------------
// Global app namespace
// ------------------------------------------------
// variables declared outside of a function will go on the global scope
var app = window.app || {};
var mq; // set global var for media query check

//Velocity Animation variables
var ease_out_back = [0.175, 0.885, 0.32, 1.275],
	ease_in_back = [0.6, -0.28, 0.735, 0.045],
	ease_in_out_back = [0.68, -0.55, 0.265, 1.55];

// ------------------------------------------------
// require.js config
// ------------------------------------------------
require.config({
    'baseUrl': '/cosmos/uconnect/_partials/js', //By default load any module IDs from js/
    // 'nodeRequire': 'require',
    // 'optimize': 'none', // for DEV
    'paths': {
        // ------------------------------------------------
        // Vendor-based
        // ------------------------------------------------
        'jquery': pathToJQuery,
        'npm': '../../js/npmloader',
        'mixitup': '../../js/vendor/mixitup',
        'mixitup_debug': '../../js/vendor/mixitup_debug',
        'validate': '../../js/vendor/validate',
        'additional_methods': '../../js/vendor/additional_methods',
        'slick': '../../js/vendor/slick',
        'velocity': '../../js/vendor/velocity',
        'magnific': '../../js/vendor/magnific',
        'hover_intent': '../../js/vendor/hover_intent',
        'jbreadcrumb': '../../js/vendor/jbreadcrumb',
        'select_dropdown': 'select_dropdown',
        'wistia': '//fast.wistia.com/static/embed_shepherd-v1',
        'jquery_linkify': '../../js/vendor/jquery_linkify',
        'jquery_ui_custom': '../../js/vendor/jquery_ui_custom',
        'moment': '../../js/vendor/moment',
        'knob': '../../js/vendor/knob',
        'data_tables': '../../js/vendor/data_tables',
        'data_tables_responsive': '../../js/vendor/data_tables_responsive',
        // ------------------------------------------------
        // Homegrown-based, called inline
        // ------------------------------------------------
        'directory': 'directory',
        // 'faq': 'faq',
        'embed': 'embed',
        'slider': 'slider',
        'cookie': 'search/cookie',
        'feeds': 'feeds',
        'knob_init': 'knob_init',
        'icon': 'icon',
        'searchblox_search': 'search/searchblox_search',
        'weather': 'weather'
    },
    'shim': {
        // ------------------------------------------------
        // Vendor-based
        // ------------------------------------------------
        'jquery': {
            'exports': ['jquery', 'jQuery', '$']
        },
        'validate': {
            'deps': ['jquery']
        },
        'additional_methods': {
            'deps': ['jquery', 'validate']
        },
        'velocity': {
            'deps': ['jquery']
        },
        'mixitup': {
            'deps': ['jquery']
        },
        'mixitup_debug': {
            'deps': ['jquery', 'mixitup']
        },
        'magnific': {
            'deps': ['jquery']
        },
        'hover_intent': {
            'deps': ['jquery']
        },
        'jbreadcrumb': {
            'deps': ['jquery', 'hover_intent']
        },
        'knob': {
            'deps': ['jquery']
        },
        'data_tables': {
            'deps': ['jquery']
        },
        'data_tables_responsive': {
            'deps': ['jquery', 'data_tables']
        },
        // ------------------------------------------------
        // Homegrown-based, called inline
        // ------------------------------------------------
        'directory': {
            'deps': ['jquery', 'tabs']
        },
        // 'faq': {
        //     'deps': ['jquery', 'tabs']
        // },
        'embed': {
            'deps': ['jquery', 'magnific_init']
        },
        'slider': {
            'deps': ['jquery', 'slick']
        },
        'cookie': {
            'deps': ['jquery']
        },
        'feeds': {
            'deps': ['jquery', 'general_functions']
        },
        'knob_init': {
            'deps': ['jquery']
        },
        'icon': {
            'deps': ['jquery', 'general_functions']
        },
        'jquery_linkify': {
            'deps': ['jquery']
        },
        'jquery_ui_custom': {
            'deps': ['jquery']
        },
        'moment': {
            'deps': ['jquery']
        },
        'searchblox_search': {
            'deps': ['jquery', 'cookie', 'moment', 'jquery_ui_custom', 'jquery_linkify']
        },
        'weather': {
            'deps': ['jquery', 'magnific_init', 'general_functions']
        },
        'accordion_setup':{
            'deps': ['jquery','toggle']
        }
    }
});

// ------------------------------------------------
// Initialize App
// ------------------------------------------------
require(['app']);
