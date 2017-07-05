require(['jquery', 'magnific'], function($) {
    (function($) {
        //////////////////////////////////////////////////////////////////////////
        // Head
        //////////////////////////////////////////////////////////////////////////
            // User >> leverage Universal GA to track emplid (meta name="emplid")
            // 
            // Pulled out of uconnect-page-foot-scripts.hbs
            //
            // {{#if head.activeSecurityInfo}}
            //     ga('set', '&uid', {{head.activeSecurityInfo.hcEmplId}}{{head.activeSecurityInfo.mfEmplId}});
            //     <meta name="emplid" content="{{head.activeSecurityInfo.hcEmplId}}{{head.activeSecurityInfo.mfEmplId}}">
            // {{/if}}
            // {{#if head.activeSecurityInfo}}
            //     <script>
            //         ga('set', '&uid', {{head.activeSecurityInfo.hcEmplId}}{{head.activeSecurityInfo.mfEmplId}});
            //     </script>
            // {{/if}}

        //////////////////////////////////////////////////////////////////////////
        // Header
        //////////////////////////////////////////////////////////////////////////
            // Utility bar
                // Nav
                // Main search
                    // Search type: All / Directory / Policies / Health Facts (btn group)
                    // Focus
                    // Input
                    // Submission
                    // Close btn
                    // Closed search shade w/out using close btn
                // Login/logout
            // Logo
            // Mega nav
                // Top (tab) sections
                    // Sub sections
                        // Bordered list
                        // Promo/feature buttons
                // Quick Links
                // Clicked same tab to close menu
                // Clicked off mega nav to close
            // Overview
                // Breadcrumbs
                // Expando
                    // Down
                    // Up
                // Tags
                    // When expando required
                    // When always visible

        //////////////////////////////////////////////////////////////////////////
        // Sidebar
        //////////////////////////////////////////////////////////////////////////
            // Side Nav
                // Section search (optional)
                    // Focus
                        // what section
                    // Input
                        // what section
                    // Submission
                        // what section
                // Nav items
                    // what section
                // Nav items clicked that have accordions
                    // what section
                // Accordions
                    // Expanded
                        // what section
                    // Closed
                        // what section
                // Mobile click
                    // what section
            // Shopping Cart
                // HFFY name/id link
                // Remove HFFY
                // Place order
                // Mobile click

        //////////////////////////////////////////////////////////////////////////
        // Slick Slider
        //////////////////////////////////////////////////////////////////////////
            // Navigation
                // Circle btns
                // L/R square btns

        //////////////////////////////////////////////////////////////////////////
        // [TAB] Main Content Tabs
        //////////////////////////////////////////////////////////////////////////
            // Tab click
                // When only icon is present (mobile)

        //////////////////////////////////////////////////////////////////////////
        // [TAB] Focus
        //////////////////////////////////////////////////////////////////////////
            // Link clicked

        //////////////////////////////////////////////////////////////////////////
        // [TAB] FAQ
        //////////////////////////////////////////////////////////////////////////
            // Accordions
                // open/close

        //////////////////////////////////////////////////////////////////////////
        // [TAB] Directory
        //////////////////////////////////////////////////////////////////////////
            // Error loading
                // Click on "Let us know" email link
            // Link clicked
                // from "Contact Details"
                // from "More Information"
                // from "Associated"
                // from "Staff"
                // from "More Information"

        //////////////////////////////////////////////////////////////////////////
        // [TAB] iFrame
        //////////////////////////////////////////////////////////////////////////
            // iFrame click
                // what section
            // "Download"
                // what section
                // what document
            // "View Full Screen"
                // what section
                // what document

        //////////////////////////////////////////////////////////////////////////
        // Promos
        //////////////////////////////////////////////////////////////////////////
            // Hover
            // Click

        //////////////////////////////////////////////////////////////////////////
        // Box
        //////////////////////////////////////////////////////////////////////////
            // Article
                // Article link click
                    // what section
                    // where was article on the page? (or, what implementation was used: img on left/top, feed, etc.)
                // Left ?
                // Top ?
                // Middle ?
                // Hover (and then article expands and image is hidden)
                    // Article link click
                    // what section
                    // where was article on the page? (or, what implementation was used: img on left/top, feed, etc.)
                // Bottom
                    // Link
                        // text
                        // what section
                        // where was article on the page? (or, what implementation was used: img on left/top, feed, etc.)
                    // Keywords
                        // Expando open
                        // Expando close
                        // Keyword clicked when expando open
                        // Keyword clicked when expando closed

        //////////////////////////////////////////////////////////////////////////
        // Mixitup
        //////////////////////////////////////////////////////////////////////////
            // Filter/show dropdown(s)
                // open
                    // what dropdown
                // click on dropdown option
                    // what dropdown
            // Sort
                // Sort name
            // Mixitup results
                // link clicked
                    // filter applied when clicked
                    // sort applied when clicked        

        //////////////////////////////////////////////////////////////////////////
        // SEARCH
        //////////////////////////////////////////////////////////////////////////
            // Overview bar
                // remove filter
                    // single
                    // all
            // Sidenav
                // Filter By
                    // Company
                    // Type
                    // Tag
            // Featured Result
                // article click
                // Keyword click
            // Search results
                // article click
                // Keyword click
            // Pagination
                // direct number click
                // L/R arrow click

        //////////////////////////////////////////////////////////////////////////
        // HFFY Landing
        //////////////////////////////////////////////////////////////////////////
            // Browse by Category
                // Link click

        //////////////////////////////////////////////////////////////////////////
        // HFFY
        //////////////////////////////////////////////////////////////////////////
            // "Add to Cart"
                // what section
                // what document
            // Alternate version click

        //////////////////////////////////////////////////////////////////////////
        // Policy & Department Company Landing
        //////////////////////////////////////////////////////////////////////////
            // Sidebar
                // Section search (optional)
                    // Focus
                        // what section
                    // Input
                        // what section
                    // Submission
                        // what section
                // H1 header
                    // link click
                        // what section
                // Accordions
                    // Expanded
                        // what section
                        // Child click
                            // what section
                    // Closed
                        // what section
                        // Parent click
                            // what section

        //////////////////////////////////////////////////////////////////////////
        // Footer
        //////////////////////////////////////////////////////////////////////////
            // Report out of date content
            // Breadcrumbs row
                // Logo
                // crumb link that doesn't have truncation plugin applied
                // crumb that does
            // Updates row
                // U-Connect search
                    // Focus
                    // Input
                    // Submission
                // U-Connect nav (help/tips, update/event)
                // Update box
            // Utility row
                // UW Health logo
                // Nav items


        //////////////////////////////////////////////////////////////////////////
        // Magnific Analytics Events
        //////////////////////////////////////////////////////////////////////////
        $('.mfp-close').click(function() {
            _gaq.push(['_trackEvent', 'User Activity', 'Lightbox', 'Close']);
        });
        $('.mfp-arrow-left').click(function() {
            _gaq.push(['_trackEvent', 'User Activity', 'Lightbox', 'Gallery - Left Arrow']);
        });
        $('.mfp-arrow-right').click(function() {
            _gaq.push(['_trackEvent', 'User Activity', 'Lightbox', 'Gallery - Right Arrow']);
        });
        $('.mfp-img').click(function() {
            _gaq.push(['_trackEvent', 'User Activity', 'Lightbox', 'Gallery - Image Click']);
        });
        $('.mfp-title').find('a').click(function() {
            _gaq.push(['_trackEvent', 'User Activity', 'Lightbox', 'Gallery - Title Link: ' + $(this).text()]);
        });
        $('.popup-modal-dismiss').click(function() {
            _gaq.push(['_trackEvent', 'User Activity', 'Lightbox', 'Modal - Dismiss/Close']);
        });
        $('.mfp-preloader').find('a').click(function() {
            _gaq.push(['_trackEvent', 'User Activity', 'Lightbox', 'Error: could not be loaded - ' + $(this).attr('href')]);
        });
    })(jQuery);
});