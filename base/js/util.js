function scrollToTop(target, offset) {
    var $target = null;

    if (target != null) {
        if (typeof (target.jquery) != 'undefined') {
            $target = target; // jQuery wrapped set
        }
        else {
            $target = $(target); // string or other selector expression
        }
        if ($target.length == 0) {
            $target = $('body');  // the selector can't find the specified element, so use the body element.
        }
    }
    else {
        $target = $('body');
    }

    //get the top offset of the target anchor
    var target_offset = $target.offset();
    var target_top = target_offset.top - offset;

    //goto that anchor by setting the body scroll top to anchor top
    $('html, body').animate({ scrollTop: target_top }, 500);
}

function loadUrlValues() {
    var param = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.search.substr(1).split('&'));

    var hash = (function (a) {
        if (a == "") return {};
        var b = {};
        for (var i = 0; i < a.length; ++i) {
            var p = a[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        return b;
    })(window.location.hash.substr(1).split('&'));

    var val = $.extend({}, param, hash); // load param and hash into val, hash overriding param.

    return val;
}

// Serialize an array of form elements or a set of
// key/values into a query string.
// Adapted from jQuery.param() function
function paramNoEncode(a, traditional) {

    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) {
            // Serialize array item.
            jQuery.each(obj, function (i, v) {
                if (traditional || rbracket.test(prefix)) {
                    // Treat each array item as a scalar.
                    add(prefix, v);
                } else {
                    // Item is non-scalar (array or object), encode its numeric index.
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && jQuery.type(obj) === "object") {
            // Serialize object item.
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        } else {
            // Serialize scalar item.
            add(prefix, obj);
        }
    }

    var r20 = /%20/g;
    var prefix,
    s = [],
    add = function (key, value) {
        // If value is a function, invoke it and return its value
        value = jQuery.isFunction(value) ? value() : (value == null ? "" : value);
        s[s.length] = key + "=" + value;
    };

    // Set traditional to true for jQuery <= 1.3.2 behavior.
    if (traditional === undefined) {
        traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
    }
    // If an array was passed in, assume that it is an array of form elements.
    if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a))) {
        // Serialize the form elements
        jQuery.each(a, function () {
            add(this.name, this.value);
        });
    } 
    else {
        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
        }
    }
    // Return the resulting serialization
    return s.join("&").replace(r20, "+");

};

if (typeof (jQuery.cachedScript) == "undefined") {
    // The jQuery.getScript() method sets the cache to false.
    // Use the cachedScript() method to get the script using the browser's cached version if there is one.
    jQuery.cachedScript = function (url, options) {
        // allow user to set any option except for dataType, cache, and url
        options = $.extend(options || {}, {
            dataType: "script",
            cache: true,
            url: url
        });
        // Use $.ajax() since it is more flexible than $.getScript
        // Return the jqXHR object so we can chain callbacks
        return jQuery.ajax(options);
    };
}

