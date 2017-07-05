/*
 * jquery.facetview.js
 *
 * displays faceted browse results by querying a specified index
 * can read config locally or can be passed in as variable when executed
 * or a config variable can point to a remote config
*/

// first define the bind with delay function from (saves loading it separately) 
// https://github.com/bgrins/bindWithDelay/blob/master/bindWithDelay.js

(function($) {
    $.fn.bindWithDelay = function( type, data, fn, timeout, throttle ) {
    var wait = null;
    var that = this;

    if ( $.isFunction( data ) ) {
        throttle = timeout;
        timeout = fn;
        fn = data;
        data = undefined;
    }

    function cb() {
        var e = $.extend(true, { }, arguments[0]);
        var throttler = function() {
            wait = null;
            fn.apply(that, [e]);
            };

            if (!throttle) { clearTimeout(wait); }
            if (!throttle || !wait) { wait = setTimeout(throttler, timeout); }
        }

        return this.bind(type, data, cb);
    }
})(jQuery);

// add extension to jQuery with a function to get URL parameters
jQuery.extend({
    getUrlVars: function() {
        var params = new Object
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&')
        for ( var i = 0; i < hashes.length; i++ ) {
            hash = hashes[i].split('=');
            if ( hash.length > 1 ) {
            	hash[1] = decodeURI(hash[1]);
                if ( hash[1].replace(/%22/gi,"")[0] == "[" || hash[1].replace(/%22/gi,"")[0] == "{" ) {
                    hash[1] = hash[1].replace(/^%22/,"").replace(/%22$/,"")
                    var newval = JSON.parse(unescape(hash[1].replace(/%22/gi,'"')))
                } else {
                    var newval = unescape(hash[1].replace(/%22/gi,""))
                }
				//alert(newval);
                params[hash[0]] = newval
            }
        }
        return params
    },
    getUrlVar: function(name){
        return jQuery.getUrlVars()[name]
    }
})


// now the facetview function
jQuery(function($){
    $.fn.facetview = function(options) {
	//the query variable
	var filterq=new Array();
	var filterqn=-1;
	var sortq="";
	var direction="&sortdir=desc";
	var sizeq=new Array();
	var startdate="";
	var enddate="";
	var sizefilter="";
	var dummy = false;
	//varr autosuggestflag = true;
	var autosuggestflag = false;
        // a big default value (pulled into options below)
      var resdisplay = [
            [
		    {
		    	'field':'labels',		
		    },	
		    {
		    	'field':'contenttype',
		    },	
			{
		    	'field':'breadcrumbs',
		    },						   	
			{
		    	'field':'url',
		    },
		    {
		    	'field':'col',
		    },
		    {
		    	'field':'uid',
		    },
            {
                 "field": "title",
            },
			{
           		"field": "image",
           	},
            {
               	"field":"lastmodified",
            },
            {
                "field": "context.#text",
            },
            {
                 "field": "description",
            },
			{
                "field": "directory-phone",
            },
			{
                "field": "directory-email",
            },					
            {
              	"field":"keywords",
            },
			{
                 "field":"mediaFeature",
            },
			{
                	"field":"mediumMediaFeature",
            },
			{
				"field":"og-title",
			}
            ],				
        ]
        // specify the defaults
        var defaults = {
            "config_file": false,           // a remote config file URL
            "facets":[],                    // facet objects: {"field":"blah", "display":"arg",...} 
            "result_display": resdisplay,   // display template for search results
            "display_images": true,         // whether or not to display images found in links in search results
            "description":"",               // a description of the current search to embed in the display
            "search_url":"",                // the URL against which to submit searches
            'default_url_params': {
      		'facet':'on',
      		'xsl':'json'
    	},        
// any params that the search URL needs by default
            "freetext_submit_delay":"500",  // delay for auto-update of search results
            "query_parameter":"query",          // the query parameter if required for setting to the search URL
            "query":"",                         // default query value
            "predefined_filters":{},        // predefined filters to apply to all searches
            "paging":{
                "from":0,                   // where to start the results from
                "size":10                   // how many results to get
            },
            "filter":[],
            "nofsuggest":10
        }
		
        // and add in any overrides from the call
        // these options are also overridable by URL parameters
        // facetview options are declared as a function so they are available externally
        // (see bottom of this file)
        var provided_options = $.extend(defaults, options)
        var url_options = $.getUrlVars()
        $.fn.facetview.options = $.extend(provided_options,url_options)
        var options = $.fn.facetview.options
        
		var first=true;
        // ===============================================
        // functions to do with filters
        // ===============================================

        // show the filter values
        var showfiltervals = function(event) {
            event.preventDefault();
            if ( $(this).hasClass('facetview_open') ) {
                $(this).children('i').replaceWith('<i class="icon-plus"></i>')
                $(this).removeClass('facetview_open');
                $(document.getElementById('facetview_' + $(this).attr('rel'))).children().hide();
            } else {
                $(this).children('i').replaceWith('<i class="icon-minus"></i>')
                $(this).addClass('facetview_open');
                $(document.getElementById('facetview_' + $(this).attr('rel'))).children().show();      
            }
        }
        
        // show the filter values initially
        var showfiltervalsinit = function() {
        	$('.facetview_filtershow').each(function(){
        		if ( $(this).hasClass('facetview_open') ) {
                	// do nothing
                } else {
                    $(this).children('i').replaceWith('<i class="icon-minus"></i>')
                    $(this).addClass('facetview_open');
                    $(document.getElementById('facetview_' + $(this).attr('rel'))).children().show();      
                }
        	});
        	$('.facetview_advfiltershow1').each(function(){
        		if ( $(this).hasClass('facetview_open') ) {
                	// do nothing
                } else {
                    $(this).children('i').replaceWith('<i class="icon-minus"></i>')
                    $(this).addClass('facetview_open');
                    $(document.getElementById('facetview_' + $(this).attr('rel'))).children().show();      
                }
        	});
        	$('.facetview_advfiltershow2').each(function(){
        		if ( $(this).hasClass('facetview_open') ) {
                	// do nothing
                } else {
                    $(this).children('i').replaceWith('<i class="icon-minus"></i>')
                    $(this).addClass('facetview_open');
                    $(document.getElementById('facetview_' + $(this).attr('rel'))).children().show();      
                }
        	});
        }


        // adjust how many results are shown
        var morefacetvals = function(event) {
            event.preventDefault()
            var morewhat = options.facets[ $(this).attr('rel') ]
            if ('size' in morewhat ) {
                var currentval = morewhat['size']
            } else {
                var currentval = 10
            }
            var newmore = prompt('Currently showing ' + currentval + 
                '. How many would you like instead?')
            //if (newmore) {
            //    options.facets[ $(this).attr('rel') ]['size'] = parseInt(newmore);
            //    $(this).html('show up to (' + newmore + ')')
            //    dosearch()
            //    if ( !$(this).parent().parent().siblings('.facetview_filtershow').hasClass('facetview_open') ) {
            //        $(this).parent().parent().siblings('.facetview_filtershow').trigger('click')
            //    }
            //}
        }

        // pass a list of filters to be displayed
        var buildfilters = function() {
            var filters = options.facets;
            var thefilters = '<h1 class="sub_heading smalls_hide">Filters</h1>';
            for ( var idx in filters ) {
                var _filterTmpl = ' \
                    <div id="facetview_filterbuttons" class=""> \
                    <h2 style="" class="facetview_filtershow srch_filter sub_heading color_lable space_n_b" \
                      rel="{{FILTER_NAME}}" href=""> \
                      <!--<i class="icon-plus"></i>--> \
                      {{FILTER_DISPLAY}}</h2> \
                      <!--<a class="btn dropdown-toggle btn-default" data-toggle="dropdown" \
                      href="#"><span class="caret"></span></a>--> \
                      <!--<ul class="dropdown-menu"> \
                      <li><a class="facetview_morefacetvals" rel="{{FACET_IDX}}" href="{{FILTER_EXACT}}">show up to ({{FILTER_HOWMANY}})</a></li>\
                      </ul>-->\
                      </div> \
                  <ul id="facetview_{{FILTER_NAME}}" \
                    class="facetview_filters list_nav list_naked"></ul> \
                    ';
                if (options.visualise_filters) {
                    var vis = '<li><a class="facetview_visualise link_naked txt_capital" rel="{{FACET_IDX}}" href="{{FILTER_DISPLAY}}">visualise this filter</a></li>'
                    thefilters += _filterTmpl.replace(/{{FACET_VIS}}/g, vis)
                } else {
                    thefilters += _filterTmpl.replace(/{{FACET_VIS}}/g, '')
                }
                thefilters = thefilters.replace(/{{FILTER_NAME}}/g, filters[idx]['field'].replace(/\./gi,'_')).replace(/{{FILTER_EXACT}}/g, filters[idx]['field']);
                if ('size' in filters[idx] ) {
                    thefilters = thefilters.replace(/{{FILTER_HOWMANY}}/gi, filters[idx]['size'])
                } else {
                    thefilters = thefilters.replace(/{{FILTER_HOWMANY}}/gi, 10)
                }
                thefilters = thefilters.replace(/{{FACET_IDX}}/gi,idx)
                if ('display' in filters[idx]) {
                    thefilters = thefilters.replace(/{{FILTER_DISPLAY}}/g, filters[idx]['display'])
                } else {
                    thefilters = thefilters.replace(/{{FILTER_DISPLAY}}/g, filters[idx]['field'])
                }
            }
            $('#facetview_filters').html("").append(thefilters);
            $('.facetview_morefacetvals').bind('click',morefacetvals);
            $('.facetview_filtershow').bind('click',showfiltervals);

        }

        var fixadvfilters = function()
        {
            var advfilterhtml='<div id="facetview_filterbuttons" class="btn-group col-sm-12">\
                  <a style="text-align:left; min-width:70%;" class="facetview_advfiltershow1 btn btn-default" rel="advfilterdate" href="">\
                  <i class="icon-plus"></i>\
                  Date</a></div>\
        	  <div id="facetview_advfilterdate">\
        		<span>\
        			<ul>\
        			<a href="javascript:void(0)" class="facetview_filterchoice1"><li sn="0" id="optiondatefrom_Last24">Last 24 hours (0)</li></a>\
        			<a href="javascript:void(0)" class="facetview_filterchoice1"><li sn="1" id="optiondatefrom_pweek">Past Week (0)</li></a>\
        			<a href="javascript:void(0)" class="facetview_filterchoice1"><li sn="2" id="optiondatefrom_pmonth">Past Month (0)</li></a>\
        			<a href="javascript:void(0)" class="facetview_filterchoice1"><li sn="3" id="optiondatefrom_pyear">Past Year (0)</li></a>\
        			<a href="javascript:void(0)" class="facetview_filterchoice1"><li id="optiondatefrom_custom">Custom</li></a>\
        			</ul>\
        			<div class="daterange_facet" >\
        			  <div class="control-group">\
        			    <label class="control-label">From:</label>\
        			    <div class="controls">\
                			<div class="input-group">\
        				    <span class="input-group-addon"><i class="icon-calendar"></i></span><input class="span2 form-control" readonly id="start_date" size="16" type="text" value="'+moment().subtract('days',1).format("MM/DD/YYYY")+'">\
                			</div>\
        			    </div>\
        			  </div>\
				      <div class="control-group">\
				        <label class="control-label">To:</label>\
				        <div class="controls">\
					      <div class="input-group">\
        				  <span class="input-group-addon"><i class="icon-calendar"></i></span><input class="span2 form-control" readonly id="end_date" size="16" type="text" value="'+moment().format("MM/DD/YYYY")+'">\
					      </div>\
				        </div>\
        			    <div class="btn btn-primary" id="date_go" style="margin-bottom:10px; margin-top:10px; -webkit-border-radius:5px; border-radius:5px;">Go!</div>\
        			  </div>\
				    </div>\
        		</span>\
        	  </div>';
//            advfilterhtml += '<div id="facetview_filterbuttons" class="btn-group col-sm-12" style="margin-top:10px;"><a style="text-align:left; min-width:70%;" class="facetview_advfiltershow2 btn btn-default" rel="advfiltersize" href="">\
//                  <i class="icon-plus"></i>\
//                  Size</a> </div>\
//      	  	      <div>\
//        				<ul id="facetview_advfiltersize">\
//            			<a href="javascript:void(0)" class="facetview_filterchoice1" style="display:none;"><li id="optionsizefrom_0">&lt100kB (0)</li></a>\
//            			<a href="javascript:void(0)" class="facetview_filterchoice1" style="display:none;"><li id="optionsizefrom_1">100kB to 500kB (0)</li></a>\
//            			<a href="javascript:void(0)" class="facetview_filterchoice1" style="display:none;"><li id="optionsizefrom_2">500kB to 1MB (0)</li></a>\
//            			<a href="javascript:void(0)" class="facetview_filterchoice1" style="display:none;"><li id="optionsizefrom_3">1MB to 10MB (0)</li></a>\
//            			<a href="javascript:void(0)" class="facetview_filterchoice1" style="display:none;"><li id="optionsizefrom_4">10MB&gt (0)</li></a>\
//            			</ul>\
//        	  </div>';
			//$('#adv_filters').html("").append(advfilterhtml);
			$('.facetview_advfiltershow1').bind('click', showfiltervals);
			$('.facetview_advfiltershow2').bind('click', showfiltervals);
			$('#facetview_advfilterdate').children().hide();
			$('#facetview_advfiltersize').children().hide();
			$('.daterange_facet').children().hide();
			$('[id^="optiondatefrom_"]').each(
					function() {
						$(this).bind(
								'click',
								function() {
									daterangeclick($(this).html().replace(
											/.?[(]+\d+[)]/g, ""));
								});
					});
			$('[id^="optionsizefrom_"]').each(function() {
				$(this).bind('click', function() {
					sizerangeclick($(this).attr('id').split('_')[1]);
				});
			});
			$('#start_date').focus(function() {
				$(this).attr('old', $('#start_date').val());
			});
			$('#end_date').focus(function() {
				$(this).attr('old', $('#end_date').val());
			});
			$('#start_date').change(function() {
				var a = moment($('#start_date').val());
				var b = moment($('#end_date').val());
				if (a.diff(b) > 0) {
					$(this).val($(this).attr('old'));
					alert("Ooops...\nStart date cannot be after the end date");
				}
				;
			});
			$('#end_date')
					.change(
							function() {
								var a = moment($('#start_date').val());
								var b = moment($('#end_date').val());
								if (a.diff(b) > 0) {
									$(this).val($(this).attr('old'));
									alert("Ooops...\nEnd date cannot be before the start date");
								}
								;
							});
            $('#date_go').click(function(){
            	var datefrom=moment($('#start_date').val()).format('YYYY-MM-DDTHH:mm:ss');
            	var dateto=moment($('#end_date').val()).format('YYYY-MM-DDTHH:mm:ss');
            	var datefrom1=moment($('#start_date').val()).format('YYYY-MM-DD');
            	var dateto1=moment($('#end_date').val()).format('YYYY-MM-DD');
            	startdate="&f.lastmodified.filter=["+datefrom+"TO"+dateto+"]";
            	clickdatefilterchoice("From "+datefrom1+" to "+dateto1);
            });
        }
        
        var clicksizefilterchoice = function(a) {
            //event.preventDefault();
            
            var view="";
            if(a=='0')view="&lt100kB";
            else if(a=='1')view="100kB to 500kB";
            else if(a=='2')view="500kB to 1MB";
            else if(a=='3')view="1MB to 10MB";
            else if(a=='4')view="10MB&gt";
            view1=view.replace(/ /g,'_');
            view1=view1.replace(/&/g,'_');

            var newobj = '<li><a class="facetview_filterselected facetview_clear icon icon_after close ' + 
                'btn btn-info"' + 
                '" alt="Remove" title="Remove"' +
                ' href="javascript:void(0)" rel="sizefilter"' + ' filtername='+view1+' ><span class="txt_bold">' +
                view.replace(/\(.*\)/,'') + '</span></a></li>';
            
			// var newobj = '<a class="facetview_filterselected facetview_clear ' + 
            //    'btn btn-info"' + 
            //    '" alt="remove" title="remove"' +
            //    ' href="javascript:void(0)" rel="sizefilter"' + ' filtername='+view1+' >' +
            //    view.replace(/\(.*\)/,'') + ' <i class="icon-remove"></i></a>';
            if($('#facetview_selectedfilters').find('a[filtername="'+view1+'"]').attr('filtername')==undefined){
            //filterclick($(this).attr("rel"),$(this).attr('id').split('_')[1]);
            var temp=sizefilter;
            $('a[rel=sizefilter]').each(function(){
            	//alert($(this).attr('filtername'));
            	dummy = true;
            	$(this).click();
            });
            sizefilter=temp;
            $('#facetview_selectedfilters').append(newobj);
            $('.facetview_filterselected').unbind('click',clearsizefilter);
            $('.facetview_filterselected').bind('click',clearsizefilter);
            options.paging.from = 0;
            dosearch();
            }
            //else{alert("Filter:"+$('#facetview_selectedfilters').find('a[filtername="'+view+'"]').attr('filtername')+" already exist!!");}
        }
        
        var clearsizefilter = function(event) {
            event.preventDefault();
            $(this).remove();
            sizefilter="";
            if(!dummy)
            	dosearch();
            else
            	dummy =false;
        }
        
        var clickdatefilterchoice = function(a) {
            var view=a;
            view=view.replace(/ /g,'_');
            var newobj = '<a class="facetview_filterselected facetview_clear ' + 
                'btn btn-info"' + 
                '" alt="Remove" title="Remove"' +
                ' href="javascript:void(0)" rel="datefilter"' + ' filtername='+view+' >' +
                view.replace(/\(.*\)/,'') + ' <i class="icon-remove"></i></a>';
            
            if($('#facetview_selectedfilters').find('a[filtername="'+view+'"]').attr('filtername')==undefined){
            //filterclick($(this).attr("rel"),$(this).attr('id').split('_')[1]);
            	var temp = startdate;
            	$('a[rel=datefilter]').each(function(){
                	//alert($(this).attr('filtername'));
                	dummy = true;
                	$(this).click();
                });
            	startdate = temp;
            $('#facetview_selectedfilters').append(newobj);
            $('.facetview_filterselected').unbind('click',cleardatefilter);
            $('.facetview_filterselected').bind('click',cleardatefilter);
            options.paging.from = 0;
            //alert(startdate);
            dosearch();
            }
            //else{alert("Filter:"+$('#facetview_selectedfilters').find('a[filtername="'+view+'"]').attr('filtername')+" already exist!!");}
        }
        
        var cleardatefilter = function(event) {
            event.preventDefault();
            $(this).remove();
            startdate="";
            if(!dummy)
            	dosearch();
            else
            	dummy =false;
        }
        
        
        var sizerangeclick = function(a)
        {
            switch(a)
            {
            //f.size.range=[*TO102400]&f.size.range=[102400TO512000]&f.size.range=[512000TO1048576]&f.size.range=[1048576TO10485760]&f.size.range=[10485760TO*]
            case '0':
            	sizefilter="&f.size.filter=[*TO102400]"
            	break;
            	
            case '1':
            	sizefilter="&f.size.filter=[102400TO512000]"
            	break;
            	
            case '2':
            	sizefilter="&f.size.filter=[512000TO1048576]"
            	break;
            	
            case '3':
            	sizefilter="&f.size.filter=[1048576TO10485760]"
            	break;
            	
            case '4':
            	sizefilter="&f.size.filter=[10485760TO*]"
            	break;
            
            default:
            	sizefilter="";	
            }
            clicksizefilterchoice(a);
        }
        
        var activedate=-1;
        
        var daterangeclick = function(b)
        {
            $('.daterange_facet').children().hide();
            switch(b)
            {
            case 'Last 24 hours':
        	startdate="&f.lastmodified.filter=["+moment().subtract('days',1).format('YYYY-MM-DDTHH:mm:ss')+"TO*]";
        	activedate=0;
        	break;
        	
            case 'Past Week':
            	startdate="&f.lastmodified.filter=["+moment().subtract('days',7).format('YYYY-MM-DDTHH:mm:ss')+"TO*]";
            	activedate=1;
        	break;
        	
            case 'Past Month':
            	startdate="&f.lastmodified.filter=["+moment().subtract('months',1).format('YYYY-MM-DDTHH:mm:ss')+"TO*]";
            	activedate=2;
        	break;
        	
            case 'Past Year':
            	startdate="&f.lastmodified.filter=["+moment().subtract('years',1).format('YYYY-MM-DDTHH:mm:ss')+"TO*]";
            	activedate=3;
        	break;
   
            case 'Custom':
        	$('.daterange_facet').children().show();
                $('#start_date').datepicker();
                $('#end_date').datepicker();
                
        	break;
        	
            default:
        	startdate="";
            	enddate="";
            }
            if(b!='Custom')clickdatefilterchoice("From "+b);
        }
        
	// match options filter and data filter
	var findfilterindata = function(filter)
	{
		var found="false";
		for(var i in options.data["facets"])
			for(var n in options.data["facets"][i])
			{	
				if(n == filter){
				found="true";
				return i;}
			}
		if(found!=true)
		return -1;
	}
	
	var filterquery = new Array();
	var nf=-1;

	var removefilterquery = function(facet,filtername)
	{
		//filtername=filtername.replace(/\./g,' ');
		var s=validatefilteradd(facet,filtername);
		if(s==-1){
			//alert("Filter not available");
		}else
		{
			filterquery.splice(s,1);
			//alert(s);
			nf--;
		}
		//viewfilter();
	}
	
	var removeallcontenttypefilterquery = function(){
		
		var s=validatefilteradd('contenttype','*');
		//alert(s);
		while(s!=-1){
			//alert("while");
			filterquery.splice(s,1);
			nf--;
			s=validatefilteradd('contenttype','*');
		}
	}
		
	var validatefilteradd = function(facet,filtername)
		{
			if(filtername == '*'){
				//alert(i);
				for(var i in filterquery){	
					//alert(filterquery[i]['0']);
					if(filterquery[i]['0']==facet && filterquery[i]['1']==filtername) 
						var dummy;
						return i;			
				}
			}
			else{
				//alert(filterquery);
				for(var i in filterquery)
				{
				//	alert(filterquery[i]['0']);
					if(filterquery[i]['0']==facet && filterquery[i]['1']==filtername)
						return i;
				}
			}
			return -1;
		}

	var viewfilter = function()
	{
		for(i in filterquery)
		{
			alert(JSON.stringify(filterquery[i]));
		}
	}
		
	var addfilterquery = function(facet,filtername)
		{
	    	var s=validatefilteradd(facet,filtername);
	        if(s==-1)
	        {
	        	nf++;
	        	filterquery[nf]={'0':facet,'1':filtername};
	        }
	        //else alert("Validate fail");
		}
	
	var filterclick = function(rel,html)
	{	
		addfilterquery(rel,escape(html.replace(/%%%/g,' ')));
	}
	
	var appendfilterstoquery = function(a)
	{
		var b="";
		for(var i in filterquery)
		{
			b=b+"&f."+filterquery[i]['0']+".filter="+filterquery[i]['1'];
		}
		return(a+b);
	}

        // set the available filter values based on results
        var putvalsinfilters = function(data)
	{
	// for each filter setup, find the results for it and append them to the relevant filter
	for ( var each in options.facets ) {
        $(document.getElementById('facetview_' + options.facets[each]['field'].replace(/\./gi,'_'))).children().remove();
		var n = findfilterindata(options.facets[each]['field']);
		if(n==-1)continue;
		var records = data["facets"][n][options.facets[each]['field']];
		var totcount=records[0];
		var a="@name";
		if(options.facets[each]['field']=='lastmodified')
		{
		for ( var item in records[1]) {
                    var append = '<li class="fltchoice"><p id="fltchoice_'+records[1][item][a]+ 
                        '" rel="' + options.facets[each]['field'] + '"   class="facetview_filterchoice"'+' href="#">' + moment((isNumber(records[1][item][a])?parseInt(records[1][item][a]):records[1][item][a])).format("dddd, MMMM Do YYYY, h:mm:ss a") +
                        ' (' + records[1][item]['#text'] + ')</p></li>';
                    $('#facetview_' + options.facets[each]['field'].replace(/\./gi,'_')).append(append);
                }
		}
		else if(options.facets[each]['field']=='indexdate')
		{
			for ( var item in records[1]) {
	                    var append = '<li class="fltchoice"><p id="fltchoice_'+records[1][item][a]+ 
	                        '" rel="' + options.facets[each]['field'] + '"   class="facetview_filterchoice"'+' href="#">' + moment((isNumber(records[1][item][a])?parseInt(records[1][item][a]):records[1][item][a])).format("dddd, MMMM Do YYYY, h:mm:ss a") +
	                        ' (' + records[1][item]['#text'] + ')</p></li>';
	                    $('#facetview_' + options.facets[each]['field'].replace(/\./gi,'_')).append(append);
	                }
		}
		else if(options.facets[each]['field']=='size')
		{
			for ( var item in records[1]) {
			    var sz=parseInt(records[1][item][a]);
			    var type="bytes";
			    if(sz>1024){sz=sz/1024;type="KB"}
			    if(sz>1024){sz=sz/1024;type="MB"}
	                    var append = '<li class="fltchoice"><a id="fltchoice_'+records[1][item][a]+ 
	                        '" rel="' + options.facets[each]['field'] + '"   class="facetview_filterchoice"'+' href="#">' + Math.floor(sz) + " " + type +
	                        ' (' + records[1][item]['#text'] + ')</a></li>';
	                    $('#facetview_' + options.facets[each]['field'].replace(/\./gi,'_')).append(append);
	                }
		}
		//Add tag icon
		else if(options.facets[each]['field']=='keywords')
		{
                for ( var item in records[1]) {
                    var append = '<li class="fltchoice"><a id="fltchoice_'+records[1][item][a].replace(/ /g,'%%%')+ 
                        '" rel="' + options.facets[each]['field'] + '" class="facetview_filterchoice"'+' href="#" forcloudrel="'+records[1][item]['#text']+'" forcloudtag="'+records[1][item][a]+'"><span class="icon icon_before company_color icon_tag"></span>' + records[1][item][a] +
                        ' <span class="color_label">(' + records[1][item]['#text'] + ')</span></a></li>';
                    $(document.getElementById('facetview_' + options.facets[each]['field'].replace(/\./gi,'_'))).append(append);
                }
         }
		else{
                for ( var item in records[1]) {
                    var append = '<li class="fltchoice"><a style="text-transform: capitalize;" id="fltchoice_'+records[1][item][a].replace(/ /g,'%%%')+ 
                        '" rel="' + options.facets[each]['field'] + '" class="facetview_filterchoice "'+' href="#" forcloudrel="'+records[1][item]['#text']+'" forcloudtag="'+records[1][item][a]+'"><span class="icon icon_before company_color icon_'+records[1][item][a].toLowerCase().replace(/ /g, '')+'"></span>' + records[1][item][a] +
                        ' <span class="color_label">(' + records[1][item]['#text'] + ')</span></a></li>';
                    $(document.getElementById('facetview_' + options.facets[each]['field'].replace(/\./gi,'_'))).append(append);
                }
            }
		
		if ( !$('.facetview_filtershow[rel="' + options.facets[each]['field'].replace(/\./gi,'_') + '"]').hasClass('facetview_open') ) {
                    $(document.getElementById('facetview_' + options.facets[each]['field'].replace(/\./gi,'_'))).children().hide();
        }
      }
		
    $('.facetview_filterchoice').bind('click',clickfilterchoice);
  }
        
        
  //function to check if string only contains numbers
        var isNumber = function(string){
        	var isnum = /^\d+$/.test(string);
        	return isnum;
        }
        
        // ===============================================
        // functions to do with building results
        // ===============================================

        // read the result object and return useful vals depending on if ES or SOLR
        // returns an object that contains things like ["data"] and ["facets"]
        var parseresults = function(dataobj) {
            var resultobj = new Object();
            resultobj["records"] = new Array();
            resultobj["start"] = "";
            resultobj["found"] = "";
           
                for (var item in dataobj.results.result) {
                    if(item=="@no")
                    {
                	resultobj["records"].push(dataobj.results.result);
                	resultobj["found"] = dataobj.results['@hits'];
                	break;
                    }
                    resultobj["records"].push(dataobj.results.result[item]);
                    resultobj["found"] = dataobj.results['@hits'];
                }
	if(dataobj.facets)
	{
	resultobj["facets"] = new Object();
	if(dataobj.facets.facet)
	{
		var fname="";
		var count="";
		var facetsobj = new Object();
                for (var item in dataobj.facets.facet) 
		{
			var values = new Object();
			if(item == "@name")
			fname=dataobj.facets.facet[item];
			else if(item=="@count")
			count=dataobj.facets.facet[item];
			else if(item=="int")
			{
                    		for (var thing in dataobj.facets.facet[item])
				{
                        		values[thing]=dataobj.facets.facet[item][thing];
				}
				facetsobj[fname]= new Object();
				facetsobj['name']=fname;
				facetsobj[fname]=[count,values];
			}
		}
                resultobj["facets"][0] = facetsobj;
		options.noffilters=1;
	}
	else
	{	
		var n=0;
		for(n in dataobj.facets)
		{
			var fname="";
			var count="";
			var facetsobj = new Object();
            for (var item in dataobj.facets[n]) 
			{
				var values = new Object();
				if(item == "@name"){
					fname=dataobj.facets[n][item];
					if(fname=="lastmodified" || fname=="size")
					{
						facetsobj[fname]=new Object();
						//alert(JSON.stringify(dataobj.facets[n]['int']));
						for(var t1 in dataobj.facets[n]['int'])
						{
							var data=new Array();
							data[0]=dataobj.facets[n]['int'][t1]['@from'];
							data[1]=dataobj.facets[n]['int'][t1]['@to'];
							data[2]=dataobj.facets[n]['int'][t1]['#text'];
							facetsobj[fname][t1]=data;
						}
						//alert(JSON.stringify(facetsobj[fname]));
					}
				}
				else if(item=="@count")
				count=dataobj.facets[n][item];
				else if(item=="int")
				{
                    for (var thing in dataobj.facets[n][item])
					{
						if(thing=='@name')
						{
							values['0']=dataobj.facets[n]['int'];
							break;
						}
                       		 		values[thing]=dataobj.facets[n][item][thing];
					}
					facetsobj[fname]= new Object();
					facetsobj['name']=fname;
					facetsobj[fname]=[count,values];
				}
			}
            resultobj["facets"][n] = facetsobj;
		}
		options.noffilters=n;
	}
	}
        return resultobj;
        }

        // decrement result set
        var decrement = function(event) {
            event.preventDefault()
            if ( $(this).html() != '..' ) {
                options.paging.from = options.paging.from - options.paging.size
                options.paging.from < 0 ? options.paging.from = 0 : ""
                dosearch();
            }
        }
		
		// go to "page" result set
        var go_to_page = function(event) {
            event.preventDefault()
            if ( $(this).html() != '..' ) {
                options.paging.from = parseInt($(this).attr('href'))
                dosearch()
            }
        }

        // increment result set
        var increment = function(event) {
            event.preventDefault()
            if ( $(this).html() != '..' ) {
                options.paging.from = parseInt($(this).attr('href'))
                dosearch()
            }
        }

        // write the metadata to the page
        var putmetadata = function(data) {
            if ( typeof(options.paging.from) != 'number' ) {
                options.paging.from = parseInt(options.paging.from)
            }
            if ( typeof(options.paging.size) != 'number' ) {
                options.paging.size = parseInt(options.paging.size)
            }
			var metaTmpl = ' \
              <div id="js_srch_buttons" class="row row_narrow row_paginated"><div class="column column_auto space_b float_left"><div class="button_group">\
                  <a class="button_soft pad_v_half pad_h" data-icon="previous" id="facetview_decrement" href="{{from}}" title="Previous 10 Results"></a> \
				  {{pages}} \
                  <a  class="button_soft pad_v_half pad_h" data-icon="next" id="facetview_increment" href="{{to}}" title="Next 10 Results"></a> \
              </div></div></div> \
              ';
           // var metaTmpl = ' \
           //   <div> \
           //     <ul class="pagination" style="float:left;padding:16px;"> \
           //       <li class="prev"><a id="facetview_decrement" href="{{from}}">&laquo; back</a></li> \
           //       <li class="active"><a>{{from}} &ndash; {{to}} of {{total}}</a></li> \
          //        <li class="next"><a id="facetview_increment" href="{{to}}">next &raquo;</a></li> \
           //     </ul> \
          //    </div> \
          //    ';
            $('#facetview_metadata').html("Your search for<b> "+options.query+" </b>did not match any documents..." +
            		"<br/><br/>" +
            		"* Suggestions: Make sure all words are spelled correctly.</br>" +
            		"* Use similar words or synonyms.</br>" +
            		"* Try more general keywords.");
            if (data.found) {
                var from = options.paging.from + 1
                var size = options.paging.size
                !size ? size = 10 : ""
				var num_pages = Math.ceil(data.found/size);
				//var pages_
				//alert (num_pages);
                var to = options.paging.from+size
				var current_page = Math.floor(to/10);
				//alert (current_page);
				var pages_holder_final = '';		
				if (num_pages < 9) {
					for (i = 0; i < (num_pages); i++) {
						if ((i+1) == current_page) {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page active"';
						} else {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page"';
						}
						var pages_holder = '<a '+pagination_css+' data-icon="" id="" href="'+i*10+'" title="Page '+(i+1)+'">'+(i+1)+'</a>';
						pages_holder_final = pages_holder_final+pages_holder;
					}
				} else if ((num_pages > 9) && (current_page < 6)) {
					for (i = 0; i < 9; i++) {
						if ((i+1) == current_page) {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page active"';
						} else {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page"';
						}
						var pages_holder = '<a '+pagination_css+' data-icon="" id="" href="'+i*10+'" title="Page '+(i+1)+'">'+(i+1)+'</a>';
						pages_holder_final = pages_holder_final+pages_holder;
					}
				} else if ((num_pages > 9) && (num_pages -current_page <= 4)) {
					for (i = (num_pages - 9); i < (num_pages); i++) {
						if ((i+1) == current_page) {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page active"';
						} else {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page"';
						}
						var pages_holder = '<a '+pagination_css+' data-icon="" id="" href="'+i*10+'" title="Page '+(i+1)+'">'+(i+1)+'</a>';
						pages_holder_final = pages_holder_final+pages_holder;
					}	
				} else if ((num_pages > 9) && (current_page >= 6)) {
					for (i = (current_page - 5); i < (current_page + 4); i++) {
						if ((i+1) == current_page) {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page active"';
						} else {
							pagination_css = 'class="button_soft pad_v_half pad_h facetview_go_to_page"';
						}
						var pages_holder = '<a '+pagination_css+' data-icon="" id="" href="'+i*10+'" title="Page '+(i+1)+'">'+(i+1)+'</a>';
						pages_holder_final = pages_holder_final+pages_holder;
					}
				}
				//alert(pages_holder_final);
                data.found < to ? to = data.found : ""
                var meta = metaTmpl.replace(/{{from}}/g, from);
                meta = meta.replace(/{{to}}/g, to);
				meta = meta.replace(/{{pages}}/g, pages_holder_final);
                meta = meta.replace(/{{total}}/g, data.found);
                $('#facetview_metadata').html("").append(meta);
                $('#facetview_decrement').bind('click',decrement)
                //from < size ? $('#facetview_decrement').html('..') : ""
				from < size ? $('#facetview_decrement').hide() : ""
                $('#facetview_increment').bind('click',increment)
                //data.found <= to ? $('#facetview_increment').html('..') : ""
				data.found <= to ? $('#facetview_increment').hide() : ""
				 $('a.facetview_go_to_page').bind('click',go_to_page)
            }

        }

        var canplay = function(ext){
        	 var canPlay = false;
        	   var v = document.createElement('video');
        	   if(v.canPlayType && v.canPlayType('video/'+ext).replace(/no/, '')) {
        	       canPlay = true;
        	   }
        	   return canPlay;
        }
        
        var _uid="";
        // given a result record, build how it should look on the page
        var buildrecord = function(index) {
            var record = options.data['records'][index]
            //var result = '<tr style="float:left"><td>';
			var result = '';
			//var result = '<div class="link_naked box_card_link box_card_link_static" href="#"><article class="box_card box_panel smalls_media_block">';
            var context_flag=false;
            // add first image where available
            if (options.display_images) {
                var recstr = JSON.stringify(record['url']);
                var colid = record['col'];
                //alert(recstr);
                recstr = recstr.substring(1,recstr.length - 1);
                recstrf = recstr.substring(1,recstr.length);
                //var regex = /^(https?|ftp):\/\/.*(jpeg|png|gif|bmp|jpg|tiff)/
                //var img = regex.exec(recstr);
                var t = recstr.substring(recstr.lastIndexOf('.')+1).toLowerCase();
                //alert(t);
                if(recstr.startsWith('http')||recstr.startsWith('https')){
                	if( t == "jpg" || t == "jpeg" || t == "png" || t == "gif" || t == "bmp" ){
                		var img = new Array();
                		img[0]=recstr;
                		var isFile = false;
                	}if(t == "mpeg" || t == "mp4" || t == "flv" || t == "mpg"){
                		var play = canplay(t);
                		var img = new Array();
                		img[1]=recstr;
                		var isFile = false;
                	}
                }else if(recstr.startsWith('/') || recstrf.startsWith(':')){
                	if( t == "jpg" || t == "jpeg" || t == "png" || t == "gif" || t == "bmp"   ){
                		var img = new Array();
                		img[0]=recstr;
                		var isFile = true;
                	}if(t == "mpeg" || t == "mp4" || t == "flv" || t == "mpg" ) {
                		var play = canplay(t);
                		var img = new Array();
                		img[1]=recstr;
                		var isFile = true;
                }}
                
                var recstri = JSON.stringify(record['_autocomplete'])
                //alert(recstri);
                var regexi = /(http:\/\/\S+?\.(jpg|png|gif|jpeg))/
                var imgi = regexi.exec(recstri);
                
            }
            // add the record based on display template if available
            var display = options.result_display
            var lines = ''
            //for (var lineitem in display) {
			if (record['og-title']=="UW Health U-Connect Directory") {
				var isDirectory = true;
			}
			
                line = "";
				//**********************************************************************************************************
				//"Template" the result

				line=line+'</div>';
				if (record['typeofcontent']) {
						line = line+'<article class="srch_result box_flag space_b contain thin content_'+record['typeofcontent']+'">';
				} else {
					line = line+'<article class="srch_result box_flag space_b contain thin">';
				}
				line = line+'<figure class="box_flag_media srch_media"';
				if (record['mediaFeature']) {
					line = line+' style="background-image: url(\'https://n.uconnect.wisc.edu/'+record['mediumMediaFeature']+'\'); background-repeat: no-repeat; background-size: cover; background-position: center center;">';
				} else {
					line = line+'>';	
				}
				if (record['directory-photo']) {
					line=line+'<img class="center" src="'+record['directory-photo']+'">';
				} else {
					if (isDirectory) {
						line=line+'<span class="icon_as_media icon icon_before" data-icon="&#xe669"></span>'
					}
				}

					if (!record['mediaFeature'] && (!isDirectory)) {
						if (record['typeofcontent']) {
						line=line+'<div class="icon icon_before icon_content_type icon_'+record['typeofcontent']+' icon_as_media">';
						line=line+'<span class="visually_hidden">'+record['typeofcontent']+'</span>';
						line=line+'</div>';
						} else if (!isDirectory) {
						line=line+'	<div class="icon icon_before icon_content_type icon_as_media">';
						}
					}
					line=line+'<div class="icon_cluster';
					if (record['mediaFeature']) {
						line=line+' color_white card_cover_dark pad_t_half';
					} else {
						line=line+' color_soft';
					}
					line=line+'">';
					if (record['fileType']) {
						line=line+'<span class="icon icon_file_type icon_before icon_'+record['fileType'].toLowerCase()+' pad_b_quarter">&nbsp;</span>';
					}
					if (record['mediaFeature']) {
						if (record['typeofcontent']) {
							line=line+'<span class="icon icon_content_type icon_before icon_'+record['typeofcontent']+' pad_b_quarter">';
							line=line+'<span class="visually_hidden">'+record['typeofcontent']+'</span>';
							line=line+'</span>';
						}
					}

				if (record['pageCategories']) {
					var c=record['pageCategories'];
					var keyArray = c.toString().split(',');								
					var keyArrayLength = keyArray.length;
					if (keyArray.length > 0) {
						for (var i = 0; i < keyArrayLength; i++) {
							line=line+'<span class="icon icon_before icon_page_category icon_'+keyArray[i].trim().toLowerCase()+'">&nbsp;</span>';	
						}
                        } else {
								
					}
				}				

        		line = line+'</figure><div class="box_flag_body srch_result_body pad_n_v">';
				if (isDirectory){ 
					line = line+'<ul class="breadcrumbs srch_breadcrumbs space_n_b color_label breadcrumbs_hide_last txt_small">'+record['directory-breadcrumb']+'</a></ul>'
				} else {
					line = line+'<ul class="breadcrumbs srch_breadcrumbs space_n_b color_label breadcrumbs_hide_last txt_small">'+record['breadcrumbs']+'</a></ul>'
				}
				if (isDirectory) {
					if (record['directory-name']) {
						line = line+'<h1 class="heading srch_heading color_link"><a class="link_naked" href="'+record['url']+'">'+record['directory-name']+'&nbsp;';
					} else {
						line = line+'<h1 class="heading srch_heading color_link"><a class="link_naked" href="'+record['url']+'">'+record['title']+'&nbsp;';
					}
					if (record['company']) {
							line=line+'<aside class="srch_company absolute"><h1 class="visually_hidden">Company</h1></aside>';
					}
					line=line+'</h1>';
					if (record['directory-title']) {
						line=line+'<h2 class="txt_label txt_small color_label space_n_v">'+record['directory-title']+'</h2>';
					}
					line=line+'<dl class="list_inline p space_n_b">';
					if (record['directory-phone']) {
						line=line+'<dt class="pad_n list_item">Phone:&nbsp;</dt><dd class="list_item pad_n_v pad_r_half">'+record['directory-phone']+'</dd>';
					}
					if (record['directory-email']) {
						line=line+'<dt class="pad_n list_item">Email:&nbsp;</dt><dd class="list_item pad_n">'+record['directory-email']+'</dd>';
					}
					line=line+'</dl><br><br>';
				} else {			
					if (record['url']) {
						line=line+'<h1 class="heading srch_heading"><a class="link_naked" href="'+record['url']+'">'+record['title']+'&nbsp;</a>';
					} else {
						line=line+'<h1 class="heading srch_heading color_link"><a class="link_naked" href="'+record['url']+'">'+record['title']+'&nbsp;</a>';
					}
					line=line+'</h1>';
				}
				if (record['labels']) {
				line=line+'<aside class="srch_company"><h1 class="visually_hidden">Company</h1>';
                   var c=record['labels'];
					var keyArray = c.toString().split(',');								
					var keyArrayLength = keyArray.length;
					if (keyArray.length > 0) {
						for (var i = 0; i < keyArrayLength; i++) {
							line=line+'<span class="icon icon_before company_color icon_'+keyArray[i].trim()+'"></span>';	
						}
                        } else {
								
					}								
				line=line+'</aside>';
				}
				if (record['displayDate']) {
					line=line+'<time class="txt_small color_label txt_capital">'+record['displayDate']+'</time>';
				}
				if (!isDirectory) {
					if (record['description']) {
						line = line+'<div class="p space_n_b srch_description">'+record['description']+'</div>';
					}					
				}
				if (record['keywords']) {
					line=line+'<ul class="list_tag txt_small space_n_b">';
                    var c=record['keywords'];
					var keyArray = c.toString().split(',');								
					var keyArrayLength = keyArray.length;
					if ((keyArray.length > 0)  && (keyArray[0] !== "")) {
						for (var i = 0; i < keyArrayLength; i++) {
							line=line+'<li><a class="tag icon icon_before link_naked" href="/search/?query=keywords:'+encodeURIComponent(keyArray[i].trim())+'">'+keyArray[i].trim()+'</a></li>';	
						}
                        } else {
								
					}					
					line=line+'</ul>';
				}			
                if (line) {
                    lines += line.replace(/^\s/,'').replace(/\s$/,'').replace(/\,$/,'');
                }
            //}
			//***********************************************************************************************************
            lines ? result += lines : result += JSON.stringify(record,"","    ")
            //result += '</td></tr>'
			result +='</div></article>';
			//alert(result);
            return result;
			
        }
        

        // put the results on the page
        showresults = function(sdata) {
        	//alert("Ajax Success");
            var data = parseresults(sdata);
            options.data = data;
            
            //show suggestion if available
            var suggest = sdata["results"]['@suggest'];
            var suggestexist = false;
            var temp = "";
            if(suggest.trim() != ''){
            	suggestexist = true;
            	temp += "<table class='table table-condensed'><tbody>";
            	temp += "<tr><td><i><small><b>Did you mean : <a href='/searchblox/plugin/index.html?query="+ suggest.trim() + "'>" + suggest.trim() + "</a> ?</b></small></i></td></tr>";
            	temp += "</tbody></table>";
            }
            else{
            	suggestexist = false;
            }
           // if(suggestexist){
           // 	$('#suggest').html(temp);
           // }
           // else{
           // 	$('#suggest').html('');
           // }
            
            //show ads if available
            var adsexist = false;
            if(sdata["ads"]){
            	//var temp = "<table class='table' style='background-color: #F6F4B6;'><tbody>";
				var temp = "<article class=\"slide box_panel o_hide\"><div class=\"box_flag srch_feature thin\"><div class=\"box_flag_media srch_feature_media\" style=\"background: url('/cosmos/uconnect/img/bg/pat_bubble_large.png') center repeat;\"></div><section class=\"box_flag_body feature_body o_hide contain\"><header class=\"box_flag_head\"><label class=\"sub_heading space_b_half\">Featured Result</label><h1 class=\"h5\">";
            	//temp += "<tr><td><i><small>Results from Ads</small></i></td></tr>";
            	for(temp1 in sdata["ads"]){
            		adsexist = true;
            		var ads_graphic_url = sdata["ads"][temp1]['@graphic_url'];
            		//temp += "<tr>\
            		//		<td>\
            		//		<div class=\"row-fluid\">\
            		//		<div class=\"span10\">\
            		//		<div style=\"float:left\">\
            		temp+= "<a class=\"link_naked\" href=\"" + sdata["ads"][temp1]['@url'] + "\">" + sdata["ads"][temp1]['@title'] + "</a></h1></header>";
            		
            		//temp += '<div class="row-fluid" style="height:20px"></div><div class="row-fluid">';
            		if(ads_graphic_url!='')
            			temp += '<a href="'+ sdata["ads"][temp1]['@graphic_url'] +'" rel="prettyPhoto"> <img class="thumbnail" style="float:left; width:100px; margin:0 5px 10px 0; max-height:150px;" src="'+ sdata["ads"][temp1]['@graphic_url'] +'" /> </a>';
            		temp += "<div class=\"bigs_pad_r pad_b\">" + sdata["ads"][temp1]['@description'] + "</div>";
            		var tempurl = sdata["ads"][temp1]['@url'];
            		var t = tempurl.substring(tempurl.lastIndexOf('.')+1).toLowerCase();
            		if( t == "jpg" || t == "jpeg" || t == "png" || t == "gif" || t == "bmp" ){
            			temp += '<a href="'+ sdata["ads"][temp1]['@url'] +'" rel="prettyPhoto"> <img class="thumbnail" style="float:left; width:100px; margin:0 5px 10px 0; max-height:150px;" src="'+ sdata["ads"][temp1]['@url'] +'" /> </a>';
            		}
            		//temp += '</div>';
            		//temp += '<div class="bigs_pad_r pad_b">' + sdata["ads"][temp1]['@url'] + '</div>';
            		
            		//temp += '</tr>';
            	}
            	temp += "</section></div></article>";
            	if(adsexist)
            		$('#ads').html(temp);
            	else
            		$('#ads').html('');
            }
            
	    if(data["facets"])
		    putvalsinfilters(data);
            // put result metadata on the page
            putmetadata(data);
            // put the filtered results on the page
            $('#facetview_results').html("");
            var infofiltervals = new Array();
            $.each(data.records, function(index, value) {
                // write them out to the results div
                $('#facetview_results').append( buildrecord(index) );
                $('#facetview_results tr:last-child').linkify()
            });
            
            fixadvfiltercount();
            if(options.data['found'] && first==true)
            	{
            		//$('#sort_btn_aligner').show('slow');
            		//$('#facetview_leftcol').show('slow');
            		$('#facetview-searchbar').attr('style','margin-bottom:10px;');
            		//$('.header').attr('style','padding:5px;margin-top:15px;');
    				first=false;
                	showfiltervalsinit();
            	}
            
            $('[id=searchresult]').each(function(){
            	if($(this).attr('href').startsWith('db')){
            		var temp = options.search_url.split('servlet')[0] + 'servlet/DBServlet?col=' + $(this).attr('collectionno') + '&id=' + $(this).attr('uid');
            		$(this).attr('href',temp);
            	}
            	else if($(this).attr('uid').split(':')[0] == 'file'){
            		var temp = options.search_url.split('servlet')[0] + 'servlet/FileServlet?url=' + $(this).attr('href') + '&col=' + $(this).attr('collectionno');

            		if($(this).attr('href').startsWith('http')){
            			$(this).parent().parent().parent().parent().children().find('._searchresult_url').html($(this).attr('href'));
            		}
            		if(!$(this).attr('href').startsWith('http')){
            			$(this).attr('href',temp);
            		}
            		
            	}
            	else if($(this).attr('href').split(':')[0] == 'eml'){
            		var temp = options.search_url.split('servlet')[0] + 'servlet/EmailViewer?url=' + $(this).attr('uid') + '&col=' + $(this).attr('collectionno');
            		$(this).attr('href',temp);
            	}
            })
            
	    //update total number of results
            if(options.data['found'])
            	{
            		//$('#nofresults').html(options.data['found']+" Results Filtered By:");
					if ($("#facetview_selectedfilters li").length < 2) {
					//if ($('#facetview_selectedfilters').text() == "") {
						$('#nofresults').html(options.data['found']+" Results");
						$('a.facetview_clear_all_filters').hide();
					} else {
						$('#nofresults').html(options.data['found']+" Results Filtered By:");
						$('a.facetview_clear_all_filters').show();
					}
            		$('#sort_btn_aligner').show();
            		$('#facetview_leftcol_percolator').show();
            	}
            else
            	{
            		$('#nofresults').html("0 results found");
            		$('#sort_btn_aligner').hide();
            	}
            
           $('[thumbid=_video]').each(function(){
            	$(this).bind('click',function(){
            	$(this).attr('controls','')
            	$(this).attr('height','240')
            	$(this).attr('width','320')
            	$(this).attr('poster','')
            	})
            })
            
            //$('a[rel^="prettyPhoto"]').prettyPhoto();
            $('[id=searchresult]').each(function(){
            	$(this).bind('click',function(){
            		var clickedcol = $(this).attr('collectionno');
            		var clickeduid = $(this).attr('uid');
            		var clickedtitle = $(this).children().html();
            		var clickedurl = escape($(this).attr('href'));
            		$.ajax({
                        type: "get",
						url: "https://dev.uconnect.wisc.edu/searchblox/servlet/ReportServlet",
                       // url: "../servlet/ReportServlet",
                        data:"addclick=yes&col="+clickedcol+"&uid="+clickeduid+"&title="+clickedtitle+"&url="+clickedurl+"&query="+escape(options.query)
            		});
            	});
            });
           
            $('[id=topclickedresult]').each(function(){
            	$(this).bind('click',function(){
            		var clickedcol = $(this).attr('collectionno');
            		var clickeduid = $(this).attr('uid');
            		var clickedtitle = $(this).children().html();
            		var clickedurl = $(this).attr('href');
            		$.ajax({
                        type: "get",
						url: "https://dev.uconnect.wisc.edu/searchblox/servlet/ReportServlet",
                        //url: "../servlet/ReportServlet",
                        data:"addclick=yes&col="+clickedcol+"&uid="+clickeduid+"&title="+clickedtitle+"&url="+clickedurl+"&query="+escape(options.query)
            		});
            	});
            });
            
            //tagcloud preperation
           // {
           // 	var taghtml = "<h3>Most Used Tags</h3></br><div id='facettagcloud'>";
           // 	if($('#facetview_keywords').children().find('a').length>0)
           // 		$('#facetview_keywords').children().find('a').each(function(){
           // 			taghtml += "<a href='/searchblox/plugin/index.html?query="+$(this).attr('forcloudtag')+"' tagrel='"+$(this).attr('forcloudrel')+"'>" + $(this).attr('forcloudtag') + " </a>";
           // 		})
          //  	taghtml += "</div>";
           // 	$('#facetview_leftcol_tagcloud').html(taghtml);
           // 	var list = document.getElementById("facettagcloud");
           // 	if(list.childNodes.length>0){
           // 		shuffleNodes(list);
           //     	$.fn.tagcloud.defaults = {
           //     			size: {start: 14, end: 18, unit: 'pt'},
           //     			color: {start: '#cde', end: '#f52'}
           //     	};
           //     	$(function () {
           //     		$('#facettagcloud a').tagcloud();
           //     	});
           // 	}
           // 	if($('#facettagcloud > a').length > 5)
           // 		$('#facetview_leftcol_tagcloud').show();
           // 	else
           // 		$('#facetview_leftcol_tagcloud').hide();
           // }
            
            //test percolator
            {
            	$('#facetview_leftcol_percolator > a').bind('click',function(){
            		bootalert("Register Alert","","btn-primary");
            	})
            }
                        
        }

        // ===============================================
        // functions to do with searching
        // ===============================================

	//add default params to query
	var adddefaultparams = function ( a )
	{	
		var b="";
		for(each in options.default_url_params)
		{
			b=b+"&"+each+"="+options.default_url_params[each];
		}
		for(each in options.facets)
		{
			b=b+"&facet.field="+options.facets[each]['field'];
			if(options.facets[each]['interval']!=undefined && options.facets[each]['interval'].trim()!=""){
				b += "&f."+options.facets[each]['field']+".interval="+options.facets[each]['interval']
			}
		}
		return (a+b);
	}
	
	// add extra filters to query
	var appendextrafilterstoquery = function( a ){
		var b = "";
		for(each in options.filter)
		{
			if(options.filter[each].split(',').length > 1){
				var c = options.filter[each].split(':')[1].split(',');
				for(var d = 0 ; d<c.length ; d++){
					b=b+"&filter="+options.filter[each].split(':')[0]+":"+c[d];
				}
			}
			else{
				b=b+"&filter="+options.filter[each];
			}
		}
		return (a+b);
	}

	var addfiltervalues = function(a)
	{
		var b="";
		for(var i=0;i<filterq.length;i++)
		{
			b=b+filterq[i];
		}
		return(a+b);
	}
	
	var addsizevalues = function(a)
	{
	    	var b="";
		for(var i in sizeq)
		{
		    for(j in options['facets'])
			if(options['facets'][j]['field']==i)
			b=b+'&f.'+i+'.size='+options['facets'][j]['size'];
		}
		return(a+b);
	}

	var adddefaultdatefacet = function(q)
	{
		var b='&facet.field=lastmodified&f.lastmodified.range=['+moment().subtract("days",1).format("YYYY-MM-DDTHH:mm:ss")+'TO*]&f.lastmodified.range=['+moment().subtract('days',7).format("YYYY-MM-DDTHH:mm:ss")+'TO*]&f.lastmodified.range=['+moment().subtract('months',1).format("YYYY-MM-DDTHH:mm:ss")+'TO*]&f.lastmodified.range=['+moment().subtract('years',1).format("YYYY-MM-DDTHH:mm:ss")+'TO*]';
		return(q+b);
	}
	
	var adddefaultsizefacet=function(q)
	{
		var b='&facet.field=size&f.size.range=[*TO102400]&f.size.range=[102400TO512000]&f.size.range=[512000TO1048576]&f.size.range=[1048576TO10485760]&f.size.range=[10485760TO*]';
		return(q+b);
	}
	
	
	var trim = function(s)
	{
		var a=s.replace(" ","");
		return(a);
	}
	
	var contains = function (a,e) {
		for (var i = 0; i < a.length; i++) {
		if (a[i] == e) {
		return true;
		}
		}
		return false;
		}
        	
	var z= new Array();
    // execute a search
	var oldquery = "";
	var oldsearchquery = "";
	
	var percolate = function(name, email, frequency, nodocs){
		$.ajax({
            type: "get",
            url: options.search_url,
            data:q+"&percolatoremail="+email+"&percolatorqueryname="+name+"&percolatorqueryfreq="+frequency+"&percolatorquerynodocs="+nodocs,
            success: function(data){
            }
		});
	}
	
	var bootalert = function(heading, msg, btnClass) {
		
		var fadeClass = "fade";
		{
		    var isIE = window.ActiveXObject || "ActiveXObject" in window;
		    if (isIE) {
		        fadeClass = "";
		    }
		}
		
		$("#dataAlertModal .modal-footer button").removeClass().addClass("btn").addClass(btnClass);
		if (!$('#dataAlertModal').length) {
			$('body').append('\
<div id="dataAlertModal" class="modal '+fadeClass+'" role="dialog" aria-labelledby="dataAlertLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content">\
	<div class="modal-header">\
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>\
		<h3 id="dataAlertLabel">\
			Notification\
		</h3>\
	</div>\
	<div class="modal-body">\
		<div class="form-horizontal">\
			<div class="form-group">\
				<label class="control-label col-sm-2">Query:</label>\
				<div class="controls col-sm-10">\
					<input type="text" id="_percolator-queryorg" value="'+options.query+'" disabled class="form-control">\
				</div>\
			</div>\
			<div class="form-group">\
				<label class="control-label col-sm-2">Name:</label>\
				<div class="controls col-sm-10">\
					<input type="text" id="_percolator-name" class="form-control">\
				</div>\
			</div>\
			<div class="form-group">\
				<label class="control-label col-sm-2">Email:</label>\
				<div class="controls col-sm-10">\
					<input type="text" id="_percolator-email" class="form-control">\
				</div>\
			</div>\
			<div class="form-group">\
				<label class="control-label col-sm-2">Frequency:</label>\
				<div class="controls col-sm-10">\
					<select id="_percolator-frequency" class="form-control">\
						<option>EACH</option>\
						<option>DAILY</option>\
						<option>WEEKLY</option>\
						<option>MONTHLY</option>\
					</select>\
				</div>\
			</div>\
			<div class="form-group" style="display:none">\
				<label class="control-label col-sm-2">Docs per mail:</label>\
				<div class="controls col-sm-10">\
					<select id="_percolator-docspermail" class="form-control">\
						<option>10</option>\
						<option>25</option>\
						<option>50</option>\
						<option>100</option>\
					</select>\
				</div>\
			</div>\
		</div>\
	</div>\
	<div class="modal-footer">\
		<button class="btn ' + btnClass + '" data-dismiss="modal" aria-hidden="true" id="dataAlertTempOK" style="display:none;">Ok</button>\
		<button class="btn ' + btnClass + '" id="dataAlertOK">Ok</button>\
	</div>\
</div></div></div>');
		}
			$('#_percolator-queryorg').val(options.query);
			$('#dataAlertModal #dataAlertLabel').text(heading);
			//$('#dataAlertModal').find('.modal-body').text(msg);
			/*$('html,body').animate({
		        scrollTop: $("#facetview-searchbar").offset().top},
		        'slow');*/
			$('#dataAlertModal').modal({
				show : true
			});
			$('#dataAlertOK').click(function(){
				percolate($('#_percolator-name').val(),$('#_percolator-email').val(),$('#_percolator-frequency').children("option").filter(":selected").val(),$('#_percolator-docspermail').children("option").filter(":selected").val());
				//testfs();
				$('#dataAlertTempOK').trigger('click');
			});
	}
	
	$('.facetview_clear_all_filters').bind('click',clearallfilters);
	
    var dosearch = function() {
    	$('.facetview_clear_all_filters').bind('click',clearallfilters);
        // update the options with the latest query value from query box
        options.query = $('#facetview_freetext').val().trim();
		//alert($('#facetview_freetext').val().trim());
		//options.query = options.query.replace('* AND keywords','');
		//options.query = $('#facetview_freetext').text().trim()
        //if(oldquery.trim() == options.query.trim())
        //return ;
       //   alert (options.query)
       //oldquery = options.query;
       // $('body').scrollTop(0);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
        //setting autocomplete
        if(autosuggestflag){
    	$.ajax({
            type: "post",
            url: "../servlet/AutoSuggest",
		data:"q="+options.query+"&limit="+options.nofsuggest,
            dataType: "json",
            success: function(data){
                		var temp = new Array();
                		for(var i in data[0]){
                			temp.push(data[0][i]);
                		}
                		
            			if(temp.length>=1)
            			{
            				z=temp;
            				$('#facetview_freetext').autocomplete({
            					source : z
            				});
            			}
            	}
          });
    	}
        else{
        	//$('#facetview_freetext').autocomplete( "destroy" );
        }
    		  	
        	
	    //refresh query
	    q=" ";
            // make the search query
	    //q="query="+encodeURI(escape(options.query));
	    q="query="+escape(encodeURIComponent(options.query));
	    // add default params
	    q=adddefaultparams(q);
	    // add facet filter values to query
	    q=appendfilterstoquery(q);
	    // add extra filters to query
	    q=appendextrafilterstoquery(q);
	    // add size values of filter
	    q=addsizevalues(q);
	    //update sort and direction variables
	    q+=sortq;
	    q+=direction;
	    // update start page variable on new query
	    if(oldsearchquery != encodeURIComponent(options.query).trim())
	    	options.paging.from = 0;
	    // update the page variable
	    var d = parseInt(options.paging.from) == 0 ? d = 1 : d = (parseInt(options.paging.from) / parseInt(options.paging.size))+1;
	    q=q+"&page="+parseInt(d);
	    // update the pagesize in query
	    q=q+"&pagesize="+options.paging.size;
	    //update with the daterange variables
	    q+=startdate;
	    //addsizefacetsilent
//	    q=adddefaultsizefacet(q);
	    //update query with size filters
	    q+=sizefilter
	    //q=trim(q);
	    
	   // alert(q.trim().replace(/ /g,''));
	   // alert(oldquery.trim().replace(/ /g,''));
	    if(q.trim() == oldquery.trim()){
	    //	alert("aasw")
	    	return;
	    }
	    //.replace(/ /g,'')
	    oldquery = q.trim();
	    oldsearchquery = encodeURIComponent(options.query).trim();
	    
	    //addlastmodifiedfacetsilent
	    q=adddefaultdatefacet(q);
		
		function getKeywordFilter(str) {
			return str.split(':')[1];
		}
		function getFilteredQuery(str) {
			return str.split('keywords')[0];
		}		
		if (options.query.indexOf("keywords:") > -1) {
			q=q+"&f.keywords.filter="+encodeURIComponent(getKeywordFilter(options.query));
			//q=q.replace(escape(encodeURIComponent(options.query)),getFilteredQuery(options.query));
			q=q.replace(escape(encodeURIComponent(options.query)),'*');
		}
	    if($('#facetview_freetext').val().trim() != ""){
              /*$.ajax({
                type: "get",
                url: options.search_url,
                data:q,
                dataType: "json",
                success: showresults
              });*/
	    	displayloader();
	    	$.getJSON(options.search_url,"callback=?&"+q,
	    			function(data) {
						//alert(q);
	    				createCookie("searchblox_plugin_query",q,0);
	    				$.getJSON("https://dev.uconnect.wisc.edu/searchblox/servlet/ReportServlet","callback=?&gettopclicks=yes&nodocs=5&query="+options.query,function(_data){
						//$.getJSON("../servlet/ReportServlet","callback=?&gettopclicks=yes&nodocs=5&query="+options.query,function(_data){
	    					data=_data.response;
	    					var temphtml = "<h3>Most Viewed</h3></br>";
	    					if(data!="nodocs"&&data!="queryerror"&&data!="")
	    						/*for(var x in data[0]){
	    							temphtml += data[0][x];
	    						}*/
	    						for(var x in data)
	    							for(var y in data[x])
	    								temphtml += data[x][y];
	    					$('#facetview_leftcol_topclicks').html(temphtml);
                        	if(data!="nodocs"&&data!="queryerror"&&data!="")$('#facetview_leftcol_topclicks').show();
                        	else $('#facetview_leftcol_topclicks').hide();
	    				})
	    				
	    				if(data["error"]!=undefined){
	    					$('#ads').html('<div class="alert alert-danger">'+
	    							'<div class="content" style="color:red;font-weight:bold;text-align:center;letter-spacing:1px;">' +
	    							data["error"] + 
	    							'</div></div>');
	    					$('#ads').parent().parent().css("margin-left", "-100px");
	    					$('#ads').parent().parent().css("float", "left");
	    					hideloader();
	    					return;
	    				}
	    				
    					$('#ads').html('');
    					$('#ads').parent().parent().css("margin-left", "");
    					$('#ads').parent().parent().css("float", "");
	    				showresults(data);
	    				hideloader();
	    	});
	    }
        }

        // trigger a search when a filter choice is clicked
        var clickfilterchoice = function(event) {
            event.preventDefault();
			            var newobj = '<li class="filterable"><a class="facetview_filterselected facetview_clear icon icon_after close btn btn-info" rel="' + $(this).attr("rel") + '" alt="remove" title="remove" href="' + $(this).attr("href") + '" filtername=' + splitStringfromFirst($(this).attr('id'),'_')[1] + '><span class="txt_bold">' + $(this).html().replace(/\(.*\)/,'') + '</span></a></li>';
            //alert($(this).attr('id'));
           // var newobj = '<a class="facetview_filterselected facetview_clear icon ' + 
           //     'btn btn-info" rel="' + $(this).attr("rel") + 
           //     '" alt="remove" title="remove"' +
           //     ' href="' + $(this).attr("href") + '" filtername='+splitStringfromFirst($(this).attr('id'),'_')[1]+' >' +
          //      $(this).html().replace(/\(.*\)/,'') + ' <i class="icon-remove"></i></a>';
            if($('#facetview_selectedfilters').find('a[rel='+$(this).attr("rel")+'][filtername=\''+splitStringfromFirst($(this).attr('id'),'_')[1]+'\']').attr('filtername')==undefined){
            filterclick($(this).attr("rel"),splitStringfromFirst($(this).attr('id'),'_')[1]);
            $('#facetview_selectedfilters').append(newobj);
            $('.facetview_filterselected').unbind('click',clearfilter);
            $('.facetview_filterselected').bind('click',clearfilter);
			$('.facetview_clear_all_filters').bind('click',clearallfilters);
            options.paging.from = 0;
            dosearch();}
            //else{alert("Filter:"+$('#facetview_selectedfilters').find('a[filtername=\''+splitStringfromFirst($(this).attr('id'),'_')[1]+'\']').attr('filtername')+" already exist!!");}
        }
        
        var splitStringfromFirst = function(str,splitter){
        	var d = str.indexOf(splitter);
  		  	if(0>d)return str;
  		  	else{
  		  		return [str.substr(0,d) , str.substr(d+splitter.length)];
  		  	}
        }

        // clear a filter when clear button is pressed, and re-do the search
        var clearfilter = function(event) {
            event.preventDefault();
            removefilterquery($(this).attr('rel'),escape($(this).attr('filtername').replace(/%%%/g,' ')));
            $(this).parent().remove();
			//$(this).remove();
			options.paging.from = 0;
            dosearch();
        }
		
		//$('.facetview_clear_all_filters').bind('click',clearallfilters);
        // clear all filters
        var clearallfilters = function(event) {
            event.preventDefault();
			//alert("clear all");
			removeallcontenttypefilterquery();
            //removefilterquery('keywords','*');
			$("#facetview_selectedfilters li.filterable").remove();
            //$(this).remove();
            dosearch();
        }		

        // do search options
        var fixmatch = function(event) {
            event.preventDefault();
            if ( $(this).attr('id') == "facetview_partial_match" ) {
                var newvals = $('#facetview_freetext').val().replace(/"/gi,'').replace(/\*/gi,'').replace(/\~/gi,'').split(' ');
                var newstring = "";
                for (item in newvals) {
                    if (newvals[item].length > 0 && newvals[item] != ' ') {
                        if (newvals[item] == 'OR' || newvals[item] == 'AND') {
                            newstring += newvals[item] + ' ';
                        } else {
                            newstring += '*' + newvals[item] + '* ';
                        }
                    }
                }
				
                $('#facetview_freetext').val(newstring);
            } else if ( $(this).attr('id') == "facetview_fuzzy_match" ) {
                var newvals = $('#facetview_freetext').val().replace(/"/gi,'').replace(/\*/gi,'').replace(/\~/gi,'').split(' ');
                var newstring = "";
                for (item in newvals) {
                    if (newvals[item].length > 0 && newvals[item] != ' ') {
                        if (newvals[item] == 'OR' || newvals[item] == 'AND') {
                            newstring += newvals[item] + ' ';
                        } else {
                            newstring += newvals[item] + '~ ';
                        }
                    }
                }
				
                $('#facetview_freetext').val(newstring);
            } else if ( $(this).attr('id') == "facetview_exact_match" ) {
//                var newvals = $('#facetview_freetext').val().replace(/"/gi,'').replace(/\*/gi,'').replace(/\~/gi,'').split(' ');
//                var newstring = "";
//                for (item in newvals) {
//                    if (newvals[item].length > 0 && newvals[item] != ' ') {
//                        if (newvals[item] == 'OR' || newvals[item] == 'AND') {
//                            newstring += newvals[item] + ' ';
//                        } else {
//                            newstring += '"' + newvals[item] + '" ';
//                        }
//                    }
//                }
//                $.trim(newstring,' ');
//                $('#facetview_freetext').val(newstring);
            	

                var newvals = $('#facetview_freetext').val().replace(/"/gi,'').replace(/\*/gi,'').replace(/\~/gi,'').split(' ');
				//alert(newvals);
                var newstring = "";
                for (item in newvals) {
                    if (newvals[item].length > 0 && newvals[item] != ' ') {
                        if (newvals[item] == 'OR' || newvals[item] == 'AND') {
                            newstring += newvals[item] + ' ';
                        } else {
                            newstring += '' + newvals[item] + ' ';
                        }
                    }
                }
                $.trim(newstring,' ');
                $('#facetview_freetext').val("\"" + newstring + "\"");
            
            	
            } else if ( $(this).attr('id') == "facetview_match_all" ) {
				
                $('#facetview_freetext').val($.trim($('#facetview_freetext').val().replace(/ OR /gi,' ')));
                $('#facetview_freetext').val($('#facetview_freetext').val().replace(/ /gi,' AND '));
            } else if ( $(this).attr('id') == "facetview_match_any" ) {
              
				$('#facetview_freetext').val($.trim($('#facetview_freetext').val().replace(/ AND /gi,' ')));
                $('#facetview_freetext').val($('#facetview_freetext').val().replace(/ /gi,' OR '));
            }
            $('#facetview_freetext').focus().trigger('keyup');
        }


        // adjust how many results are shown
        var howmany = function(event) {
            event.preventDefault()
            var newhowmany = prompt('Currently displaying ' + options.paging.size + 
                ' results per page. How many would you like instead?')
            if (newhowmany) {
                options.paging.size = parseInt(newhowmany)
                options.paging.from = 0
                $('#facetview_howmany').html('results per page (' + options.paging.size + ')')
                dosearch();
            }
        }

        // adjust how many suggestions are shown
        var howmanynofsuggest = function(event) {
            event.preventDefault()
            var newhowmany = prompt('Currently displaying ' + options.nofsuggest + 
                ' suggestions per page. How many would you like instead?')
            if (newhowmany) {
                options.nofsuggest = parseInt(newhowmany)
                options.paging.from = 0
                $('#facetview_nofsuggest').html('suggestions per page (' + options.nofsuggest + ')')
                dosearch();
            }
        }
        
        var displayloader = function(){
        	var height1 = $('#facetview_results').height();
        	var width1  = $('#facetview_results').width();
        	$('.loadingbg').height(height1);
        	$('.loadingbg').width(width1);
        	$('#loading').show();
        	
        }
        
        var hideloader = function(){
        	$('#loading').hide();
        }

        
        // the facet view object to be appended to the page
        var thefacetview = ' \
        	<!--<div id="facetview"> \
            	<div class="row-fluid">--> \
        	   		<aside id="sidebarSearch" class="side_content split_side column contain" role="complementary" style="float:left;"><a href="" class="sidebar_button h6 slide_anim button_soft button_med desk_hide icon icon_before" data-icon="&#xe120" data-toggle="#sidebar_content" data-icon-switch="&#xe120 &#xe625"><span class="visually_hidden txt_small txt_upper">Section Menu</span></a> \
					<span class="bigs_hide smallish_hide"></span></a> \
					<div id="sidebar_content" class="sidebar_content"> \
                		<!--<div class="well" id="facetview_leftcol" style="display:none;width:100%;float:left"> \
	    					<div class="" id="facetview_leftcol_percolator" style="float:right;display:none;"> \
    							<a class="btn btn-warning" href="#">Create Alert</a>\
	    					</div>--> \
         		 			<!--<div id="nofresults" style="margin-bottom:-34px;"></div>-->\
                  			<div id="facetview_filters"></div>\
        	 	 	 		<div id="adv_filters"></div>\
                		<!--</div>--> \
            			<!--<div class="well" id="facetview_leftcol_topclicks" style="display:none;width:100%;float:left"></div>--> \
        	    		<!--div class="well" id="facetview_leftcol_tagcloud"  style="display:none;width:100%;float:left"></div>--> \
               		</aside> \
					<div class="split_main bigs_float_right">\
                	<div class="col-sm-8" id="facetview_rightcol" align="left" style=""> \
                    	<div id="facetview-searchbar" style="margin-left:-280px;display:none;" class="input-group">\
                    		<div class="input-group-addon" style="display:none;"><i class="glyphicon glyphicon-search"></i></div>\
                    		<input class="form-control" id="facetview_freetext" name="query" value="" placeholder="search term" autofocus autocomplete="off" style="display:none;"/>\
                    		<!--<div class="input-group-addon">\
                     			<div class="btn-group">\
        							<a class="dropdown-toggle" data-toggle="dropdown" href="#"> \
                     	 	 			<i class="icon-cog"></i> <span class="caret"></span>\
        							</a> \
                     				<ul style="margin-left:-110px;" class="dropdown-menu"> \
                     					<li><a id="facetview_partial_match" href="">partial match</a></li> \
                     					<li><a id="facetview_exact_match" href="">exact match</a></li> \
                     					<li><a id="facetview_fuzzy_match" href="">fuzzy match</a></li> \
                     					<li><a id="facetview_match_all" href="">match all</a></li> \
         								<li class="divider"></li> \
     									<li><a id="facetview_autosuggest" href=""><i id="facetview_autosuggest_flag" class="icon-ok"></i>&nbsp;Autosuggest</a></li> \
                     					<li class="divider"></li> \
                     					<li><a target="_blank" href="http://www.searchblox.com/">Learn more</a></li> \
                     					<li class="divider"></li> \
                     					<li><a id="facetview_howmany" href="#">results per page ({{HOW_MANY}})</a></li> \
     									<li><a id="facetview_nofsuggest" href="#">suggestions per page ({{HOW_MANY_nofsuggest}})</a></li> \
                     				</ul> \
 			 					</div>\
							</div>-->\
 						</div>\
        				<div>\
    						<!--<div class="row-fluid" style="height:40px;" id="facetview_sortbtns">\
								<div id="sort_btn_aligner" style="display:none;text-align:center;">\
     								<div class="btn-group" data-toggle="buttons">\
 										<div class="btn btn-warning disabled">Sort By : </div>\
 										<div class="btn btn-primary" id="sort_date">Date</div>\
 										<div class="btn btn-primary" id="sort_alpha">Alphabetic</div>\
 										<div class="btn btn-primary" id="sort_relevance" disabled="true">Relevance</div>\
 										<div class="btn btn-info" id="direction" dir="desc">\
										<span class="glyphicon glyphicon-arrow-down"></span>\
 									</div>\
 								</div>\
							</div>-->\
        				</div>\
        				</div>\
                    <!--<div style="clear:both;" id="facetview_selectedfilters"></div>--> \
      	  			<div><div id="suggest"></div>\
                	<div><div id="ads"></div>\
					<div class="box_panel pad_v srch_results space_b_2" id="facetview_results">\
         	      	<!--<table class="table table-striped" id="facetview_results" style="word-break: break-all;"></table>-->\
					</div>\
                  	<div class="row-fluid" id="facetview_metadata"></div>\
					<!--</div> \
         		</div> \
              </div>--> \
            ';

        var attrsetter = function(attrname)
        {
            var attrs=['sort_date','sort_alpha','sort_relevance'];
            for(var a in attrs)
            {
        	if(attrs[a]==attrname){
        	    $('#'+attrs[a]).attr('disabled','true');
        	    continue;
        	}
        	$('#'+attrs[a]).removeAttr('disabled');
            }
        }
        
	var sorter = function()
	{
	    	attrsetter($(this).attr('id'));
		if($(this).attr('id')=='sort_date')
		{
			sortq="&sort=date";
		}
		else if($(this).attr('id')=='sort_alpha')
		{
			sortq="&sort=alpha";
		}
		else if($(this).attr('id')=='sort_relevance')
		{
			sortq="&sort=relevance";
		}
		dosearch();
	}

	var director = function()
	{
		if($(this).attr('dir')=="desc")
		{
			$(this).attr('dir','asc');
			$('span',this).attr('class','glyphicon glyphicon-arrow-up');
			direction="&sortdir=asc";
		}
		else if($(this).attr('dir')=="asc")
		{
			$(this).attr('dir','desc');
			$('span',this).attr('class','glyphicon glyphicon-arrow-down');
			direction="&sortdir=desc";
		}
		dosearch();
	}
	
	var autosuggest = function(event)
	{event.preventDefault();
		if(autosuggestflag){
			$('#facetview_freetext').autocomplete({
				source : []
			});
			autosuggestflag = false;
			$('#facetview_autosuggest_flag').attr('class','');
		}else{
			autosuggestflag = true;
			$('#facetview_autosuggest_flag').attr('class','icon-ok')
		}
	}

	var fixadvfiltercount = function()
	{
        $('[id^="optionsizefrom_"]').each(function(){
        	var n = findfilterindata("size");
        	$(this).html($(this).html().replace(/[(]+\w+[)]/,"("+options.data["facets"][n]["size"][1][$(this).attr('id').split('_')[1]]['#text']+")"));
        });
        $('[id^="optiondatefrom_"]').each(function(){
        	var n = findfilterindata("lastmodified");
        	if($(this).html()!='Custom')
        	$(this).html($(this).html().replace(/[(]+\w+[)]/,"("+options.data["facets"][n]["lastmodified"][1][$(this).attr('sn')]['#text']+")"));
        	//alert(options.data["facets"][n]["lastmodified"][1][$(this).attr('sn')]['#text']);
        });
	}
	
	
	
	
        // what to do when ready to go
        var whenready = function() {
            // append the facetview object to this object
            thefacetview = thefacetview.replace(/{{HOW_MANY}}/gi,options.paging.size);
            thefacetview = thefacetview.replace(/{{HOW_MANY_nofsuggest}}/gi,options.nofsuggest);
            $(obj).append(thefacetview);
            
            
            
            // setup search option triggers
            $('#facetview_partial_match').bind('click',fixmatch)
            $('#facetview_exact_match').bind('click',fixmatch)
            $('#facetview_fuzzy_match').bind('click',fixmatch)
            $('#facetview_match_any').bind('click',fixmatch)
            $('#facetview_match_all').bind('click',fixmatch)
            $('#facetview_howmany').bind('click',howmany)
            $('#facetview_nofsuggest').bind('click',howmanynofsuggest)
            $('#sort_date').bind('click',sorter);
            $('#sort_alpha').bind('click',sorter);
            $('#sort_relevance').bind('click',sorter);
            $('#direction').bind('click',director);
            $('#facetview_autosuggest').bind('click', autosuggest)
            
            // resize the searchbar
            //var thewidth = $('#facetview_searchbar').parent().width()
           // $('#facetview_searchbar').css('width',thewidth - 140 + 'px')
           // $('#facetview_freetext').css('width', thewidth - 180 + 'px')
            //set default size values
            for(var i in options.facets)
        	if(options.facets[i]['size'])sizeq[options.facets[i]['field']]=options.facets[i]['size'];
        	else{
        	    options.facets[i]['size']=10;
        	    sizeq[options.facets[i]['field']]=options.facets[i]['size'];
        	}
            // check paging info is available
            !options.paging.size ? options.paging.size = 10 : ""
            !options.paging.from ? options.paging.from = 0 : ""

            // append the filters to the facetview object
            buildfilters();
            //build advanced filters
            fixadvfilters();
            // set any default search values into the search bar
            if($('#facetview_freetext').val() == "" && options.query != "")
            {
            	//$('#sort_btn_aligner').show('slow');
        		//$('#facetview_leftcol').show('slow');
				$('#facetview_leftcol').show();
        		$('#facetview-searchbar').attr('style','margin-bottom:10px;');
        		//$('.header').attr('style','padding:5px;margin-top:15px;');
				
				var freetext = options.query;
				var freetext = '"' + freetext + '"';
				
            	$('#facetview_freetext').val(options.query);
				//$('#facetview_freetext').text(options.query);
				$('#facetview_freetext').text(freetext);
               	dosearch(); 
            }
            $('#facetview_freetext',obj).bindWithDelay('keyup',dosearch,options.freetext_submit_delay);
            //alert(readCookie("searchblox_plugin_query"));
            if((readCookie("searchblox_plugin_query")=="new" || readCookie("searchblox_plugin_query")==null) && (readCookie("searchblox_click")=="false" || readCookie("searchblox_click")==null))
            	createCookie("searchblox_plugin_query","new",0);
            else if(readCookie("searchblox_click")=="false" && readCookie("searchblox_plugin_query")!="new")
            {
            	createCookie("searchblox_plugin_query","new",0);
            }
            else
            	$.getJSON(options.search_url,"callback=?&"+readCookie("searchblox_plugin_query"),
    	    			function(data) {
            				createCookie("searchblox_click","false",0);
            				var temp = readCookie("searchblox_plugin_query");
            				temp=temp.split('&')[0].split('=')[1];
            				options.query=temp;
            				temp=readCookie("searchblox_plugin_query");
            				temp=temp.match(/f\.[a-zA-z0-9 ]+\.filter=[\w\d\s\-\[\:\*\]]+/g);
            				//var freetext = unescape(options.query);
							//var freetext = '"' + freetext + '"';
            				$('#facetview_freetext').val(unescape(options.query));
							//$('#facetview_freetext').val(freetext);
            				//alert(temp);
    	    				showresults(data)
    	    				for(var t in temp){
            					var facetname=temp[t].split('.')[1];
            					var filtername=temp[t].split('=')[1];
            					//alert(facetname+":::"+filtername);
            					$('[id=fltchoice_'+escape(filtername.replace(/ /g,'%%%'))+'][rel='+facetname+']').click();
            					//alert('#fltchoice_'+filtername.replace(/ /g,'.')+'[rel='+facetname+']');
            				}
            	});
            
        }

        // ===============================================
        // now create the plugin on the page
        return this.each(function() {
            // get this object
            obj = $(this);
            
            whenready();

		$('body').scrollTop(0);
		document.body.scrollTop = document.documentElement.scrollTop = 0;
        }); // end of the function  

    };

    // facetview options are declared as a function so that they can be retrieved
    // externally (which allows for saving them remotely etc)
    $.fn.facetview.options = {}

});

     //   <div class="main_content split_main column"> <small class="txt_small sub_heading">You Searched For</small>
     //     <h1 class="h2 company space_n_b" id="page_name">"Something" </h1>
     //   </div>

//Insert the search header markup
$("#body_content section.row div.main_content").html("<div id=\"page_name\" class=\"main_content split_main column\"><small class=\"txt_small sub_heading\">You searched for</small>\<h1 id=\"facetview_freetext\" placeholder=\"search term\" class=\"h2 company space_n_b\" name=\"query\"></h1>");
//$("#body_content section.row div.main_content").html("<h1 id=\"page_name\" class=\"h2 company\"><small class=\"txt_upper txt_label\">You searched for</small><br>\"<span id=\"facetview_freetext\" placeholder=\"search term\" name=\"query\"></span>\"</h1>");

$("#tag_bar div.row").html("<div class=\"side_content column tag_title\" id=\"result_tally\"><span id=\"nofresults\" class=\"sub_heading\"></span></div><ul class=\"main_content column list_tag list_inline\" id=\"facetview_selectedfilters\"><li class=\"right\"><a  filtername=\"*\" title=\"remove\" alt=\"remove\" rel=\"keywords\" class=\"facetview_clear_all_filters txt_upper txt_bold\"><span class=\"icon icon_after close\"></span> Remove Filters</a></li></ul>");
//Insert the search tag bar markup
//$("#tag_bar div.row").html("<div id=\"nofresults\" class=\"side_content split_side column txt_upper txt_small tag_title\"></div><div id=\"nofresults\" class=\"txt_small bold txt_upper\" style=\"margin-right:20px;display:inline-block\"></div><div id=\"facetview_selectedfilters\" style=\"display:inline-block\" class=\"txt_small tag_title\"></div><a filtername=\"*\" href=\"#\" title=\"remove\" alt=\"remove\" rel=\"keywords\" class=\"facetview_clear_all_filters float_right icon icon_start txt_small bold txt_upper pad_v_half\" style=\"float:right;\" data-icon=\"delete\">Remove Filters<i class=\"icon-remove\"></i></a></div>");

jQuery(document).ready(function($) {
  $('.facet_view').facetview({
    search_url: 'https://dev.uconnect.wisc.edu/searchblox/servlet/SearchServlet',
    search_index: 'searchblox',
	autosuggestflag: false,
    facets: [
        {'field': 'labels','display': 'Organization'},
		{'field': 'typeofcontent', 'display': 'Type'},
		{'field': 'pageCategories', 'display': 'Category'},
        {'field': 'keywords',  'display': 'Tag'}

    ]
  });
  
    if (typeof String.prototype.startsWith != 'function') {
	  String.prototype.startsWith = function (str){
	    return this.slice(0, str.length) == str;
	  };
	}
  
  if (typeof String.prototype.trim != 'function') {
	  String.prototype.trim = function (){
		  return this.replace(/^\s+|\s+$/g, '');
	  };
	}
  
  if (typeof String.prototype.splitOnFirst != 'function') {
	  String.prototype.splitOnFirst = function (str){
		  var d = this.indexOf(str);
		  if(0>d)return this;
		  else{
			  return [this.substr(0,d) , this.substr(d+str.length)];
		  }
	  };
	}
  
  function shuffle(items)
  {
      var cached = items.slice(0), temp, i = cached.length, rand;
      while(--i)
      {
          rand = Math.floor(i * Math.random());
          temp = cached[rand];
          cached[rand] = cached[i];
          cached[i] = temp;
      }
      return cached;
  }
  function shuffleNodes(list)
  {
      var nodes = list.children, i = 0;
      nodes = toArray(nodes);
      nodes = shuffle(nodes);
      while(i < nodes.length)
      {
          list.appendChild(nodes[i]);
          ++i;
      }
  }
  
  function toArray(obj) {
	  var array = [];
	  // iterate backwards ensuring that length is an UInt32
	  for (var i = obj.length >>> 0; i--;) { 
	    array[i] = obj[i];
	  }
	  return array;
	}
         // $('.facetview_clear_all_filters').bind('click',clearallfilters);
});
jQuery(document).ready(function($) {
	$("#sidebar").html("");
	var new_sidebar = $("#sidebarSearch").html();
	$("#sidebar").append(new_sidebar);
	$("#sidebarSearch").remove();
	//$("a[forcloudtag='policy']").click();
	//setInterval(function () {$("a[forcloudtag='policy']").click()}, 1000);
	function getFilteredFreetext(str) {
		return str.split(':')[1];
	}
	function getFilteredFreetextAnd(str) {
		return str.split('AND')[0];
	}
	if ($('#facetview_freetext').text().indexOf("keywords:") > -1) {
		var freetext = $('#facetview_freetext').text();
		$('#facetview_freetext').text('"'+getFilteredFreetext(freetext));
		$('#page_name small').text('All Things Tagged');
	}	
	if ($('#facetview_freetext').text().indexOf("AND") > -1) {
		var freetext = $('#facetview_freetext').text();
		$('#facetview_freetext').text($.trim(getFilteredFreetextAnd(freetext))+'"');
	}	
});