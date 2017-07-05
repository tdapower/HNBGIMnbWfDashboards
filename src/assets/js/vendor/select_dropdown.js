require(['jquery'], function($) {

    // http://www.icant.co.uk/forreview/tamingselect/
    // ala http://www.scribbletribe.com/how-to-style-the-select-dropdown/
    function tamingselect() {

        if (!document.getElementById && !document.createTextNode) {
            return;
        }

        // Classes for the link and the visible dropdown
        var ts_selectclass = 'select_dropdown'; // class to identify selects
        var ts_listclass = 'dd_turnintoselect'; // class to identify ULs
        var ts_boxclass = 'dd_container'; // parent element
        var ts_triggeron = 'dd_activetrigger'; // class for the active trigger link
        var ts_triggeroff = 'dd_trigger'; // class for the inactive trigger link
        var ts_dropdownclosed = 'dd_hidden'; // closed dropdown
        var ts_dropdownopen = 'dd_visible'; // open dropdown
        var ts_dropdownopen_scroll = 'scroll'; // class for scroll bar, if necessary
        var ts_dropdown_wrapper = 'dd_wrapper'; // wrapper class

        // Turn all selects into DOM dropdowns
        var count = 0;
        var toreplace = new Array();
        var sels = document.getElementsByTagName('select');
        for (var i = 0; i < sels.length; i++) {
            // if (ts_check(sels[i], ts_selectclass)) {
            // check for scroll class on container, and apply if it exists
            if (ts_check(sels[i], ts_dropdownopen_scroll)) {
                ts_dropdownopen = 'dd_visible scroll';
            }
            var hiddenfield = document.createElement('input');
            hiddenfield.name = sels[i].name;
            hiddenfield.type = 'hidden';
            hiddenfield.id = sels[i].id;
            hiddenfield.value = sels[i].options[0].value;
            sels[i].parentNode.insertBefore(hiddenfield, sels[i])
            var trigger = document.createElement('a');
            ts_addclass(trigger, ts_triggeroff);
            trigger.href = '#';
            trigger.onclick = function() {
                ts_swapclass(this, ts_triggeroff, ts_triggeron)
                ts_swapclass(this.parentNode.getElementsByTagName('ul')[0], ts_dropdownclosed, ts_dropdownopen);
                return false;
            }
            trigger.appendChild(document.createTextNode(sels[i].options[0].text));
            sels[i].parentNode.insertBefore(trigger, sels[i]);
            var replaceUL = document.createElement('ul');
            for (var j = 0; j < sels[i].getElementsByTagName('option').length; j++) {
                var newli = document.createElement('li');
                var newa = document.createElement('a');
                newli.v = sels[i].getElementsByTagName('option')[j].value;
                newli.elm = hiddenfield;
                newli.istrigger = trigger;
                newa.href = '#';
                $(newli).attr('data-value', sels[i].getElementsByTagName('option')[j].value);
                $(newli).attr('data-type', $(sels[i].getElementsByTagName('option')[j]).attr('data-type'));
                newa.appendChild(document.createTextNode(
                    sels[i].getElementsByTagName('option')[j].text));
                newli.onclick = function() {
                    this.elm.value = this.v;
                    ts_swapclass(this.istrigger, ts_triggeron, ts_triggeroff);
                    ts_swapclass(this.parentNode, ts_dropdownopen, ts_dropdownclosed)
                    this.istrigger.firstChild.nodeValue = this.firstChild.firstChild.nodeValue;
                    return false;
                }
                newli.appendChild(newa);
                replaceUL.appendChild(newli);
            }
            ts_addclass(replaceUL, ts_dropdownclosed);
            var div = document.createElement('div');
            div.appendChild(replaceUL);
            ts_addclass(div, ts_boxclass);
            sels[i].parentNode.insertBefore(div, sels[i])
            toreplace[count] = sels[i];
            count++;
            // wrap elements in <div>
            $('.dd_trigger, .dd_container').wrapAll('<div class="' + ts_dropdown_wrapper + '"></div>');
            // }
        }

        // Turn all ULs with the class defined above into dropdown navigations
        var uls = document.getElementsByTagName('ul');
        for (var i = 0; i < uls.length; i++) {
            if (ts_check(uls[i], ts_listclass)) {
                var newform = document.createElement('form');
                var newselect = document.createElement('select');
                for (j = 0; j < uls[i].getElementsByTagName('a').length; j++) {
                    var newopt = document.createElement('option');
                    newopt.value = uls[i].getElementsByTagName('a')[j].href;
                    newopt.appendChild(document.createTextNode(uls[i].getElementsByTagName('a')[j].innerHTML));
                    newselect.appendChild(newopt);
                }
                newselect.onchange = function() {
                    window.location = this.options[this.selectedIndex].value;
                }
                newform.appendChild(newselect);
                uls[i].parentNode.insertBefore(newform, uls[i]);
                toreplace[count] = uls[i];
                count++;
            }
        }
        for (i = 0; i < count; i++) {
            toreplace[i].parentNode.removeChild(toreplace[i]);
        }

        function ts_check(o, c) {
            return new RegExp('\\b' + c + '\\b').test(o.className);
        }

        function ts_swapclass(o, c1, c2) {
            var cn = o.className
            o.className = !ts_check(o, c1) ? cn.replace(c2, c1) : cn.replace(c1, c2);
        }

        function ts_addclass(o, c) {
            if (!ts_check(o, c)) {
                o.className += o.className == '' ? c : ' ' + c;
            }
        }

        // Close dropdown on document click
        $(document).click(function(e) {
            if (!$('.dd_trigger, .dd_activetrigger, .dd_container').is(e.target)) { // if the target of the click isn't the trigger nor select options
                $('.dd_activetrigger').addClass('dd_trigger').removeClass('dd_activetrigger'); // add closed trigger class
                $('.dd_visible').addClass('dd_hidden').removeClass('dd_visible'); // add hide dropdown class
                e.stopImmediatePropagation();
            }
        });
    };

    tamingselect();

});