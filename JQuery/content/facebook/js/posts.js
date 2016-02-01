// JQuery Embed for Facebook
// Author: Loren Heyns
// Company: DreamStudio.com
// Please send updates to http://DreamStudio.com/account/write/8
// This message must remain at top of script.

var fbFolder = '';
var fbLimit = 3;
var showComments = true;
var commentQuantity = 8;
var fbOffset = 0;
var includePublicFeed = false;

NCA_includePublicFeed = Cookies.get('NCA_includePublicFeed');
if (typeof NCA_includePublicFeed != "undefined") {
    
    includePublicFeed = NCA_includePublicFeed;
    
}


// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  this.splice(from, (to || from || 1) + (from < 0 ? this.length : 0));
  return this.length;
};
// Alternate - requires popup for user to signin via Facebook to get their individual access token.  
function fbFetchAccess() {
    FB.login(function (response) {
        if (response.session) {

            FB.getLoginStatus(function (response) {
                //alert('FireFox response');
                if (response.session) {
                    //alert('connected');
                    //$('#connect_button').hide();
                    //$('#res_json').html('loading...');
                    token = response.session.access_token;
                    fbFetch(response.session.access_token);
                }
            });

        } else {
            alert('Not logged into Facebook.  Unable to show latest news.');
        }
    });
}
function formatDateTicks(startDate,endDate) {
    var startdate = new Date(startDate);
    var enddate = new Date(endDate);
    return formatDate(startdate) + ' to ' + ' <span style="white-space:nowrap">' + showTheHours(enddate.getHours()) + ':' + showZeroFilled(enddate.getMinutes()) + ' ' + showAmPm(enddate) + '</span>';
}
function formatDate(startDate) {
    var days = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    var dateStr = days[startDate.getDay()];
    dateStr += ', ' + months[startDate.getMonth()] + ' ' + startDate.getDate() + ', ' + fourdigits(startDate.getYear());
    dateStr += ', <span style="white-space:nowrap">' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate) + '</span>';
    return dateStr;
}


function encode(unencoded) {
    return encodeURIComponent(unencoded).replace(/'/g,"%27").replace(/"/g,"%22");
}
function decode(encoded) {
    return decodeURIComponent(encoded.replace(/\+/g,  " "));
}
function fbFetch(token) {
    // Callback is set with a '?' to overcome the cross domain problems with JSON

    // You can also request multiple objects in a single query using the "ids" query parameter.
    // For example, the URL https://graph.facebook.com?ids=arjun,vernal returns both profiles in the same response.
    // since=today&
    $.ajaxSetup({async:false});
    // Swicth from /posts to /feed to show everyone

    var excludePublicFeedFQL = 'and actor_id in (select page_id from page where username=\'' + fbFolder + '\')';
    
    
    var url = '{"posts": "select action_links, actor_id,app_data, app_id, attachment, attribution, claim_count, comment_info, created_time, description, description_tags, expiration_timestamp, feed_targeting, filter_key, impressions, is_exportable, is_hidden, is_published, like_info, message, message_tags, parent_post_id, permalink, place, post_id, privacy, promotion_status, scheduled_publish_time, share_count, share_info, source_id, subscribed, tagged_ids, target_id,targeting,timeline_visibility, type, updated_time, via_id, viewer_id, with_location, with_tags, xid from stream where filter_key == \'owner\' and source_id in (select page_id from page where username=\''+fbFolder+'\') ' + (includePublicFeed ?  "" : excludePublicFeedFQL ) +' limit '+fbOffset+', '+fbLimit+'", "comments": "select post_id, fromid, text, time, username from comment where post_id in (select post_id from #posts)", "users": "SELECT id, name, username, url FROM profile WHERE id in (SELECT actor_id FROM #posts)"}';
    // SELECT uid,first_name, last_name FROM user WHERE uid
    // = '129055803796451'
    if (typeof (console) != 'undefined' && typeof (console.log) != 'undefined') {
        console.log('Facebook feed query:', url);
    }

    //alert('https://graph.facebook.com/fql?q=' + encodeURIComponent(url) + '&format=json&suppress_http_code=1&access_token=' + token);
    //Use jQuery getJSON method to fetch the data from the url and then create our unordered list with the relevant data.
    $.getJSON('https://graph.facebook.com/fql?q=' + encodeURIComponent(url) + '&format=json&suppress_http_code=1&access_token=' + token, function (json) {
        var html = "";

        if (typeof (json.error) != 'undefined') {
            if (typeof (console) != 'undefined' && typeof (console.error) != 'undefined') {
                console.error('Facebook returned an error: ', json.error);
            }
            $('div[id*="FacebookPanel"]').hide();
            return;
        }

        html += "<ul>";
        var commentCount = 0;

        // These aren't working...
        if (!showComments) {
            // Wrap newsText under thumbnail.  Allows for irregualar thumbnail widths, which look odd when comments don't separate.
            $('.newsText').attr('style', 'overflow: visible;');
        }
        if (showComments) {
            $('.newsText').attr('style', 'overflow:hidden;');
        }

        var posts = json.data[0].fql_result_set,
            comments = json.data[1].fql_result_set,
            users = json.data[2].fql_result_set,
            events;

        console.log(users);
        // get events
        event_ids = []
        $.each(posts, function (i, fb) {

            if (fb.attachment["media"] && fb.attachment["media"][0] && fb.attachment["media"][0]["type"] && fb.attachment["media"][0]["type"] == "link") {

                //console.log(fb.attachment["media"][0]["href"])
                ev_id_array = fb.attachment["media"][0]["href"].split('/')

                ev_id = ev_id_array[ev_id_array.length - 2]

                if (parseInt(ev_id) == ev_id) {
                    event_ids.push(ev_id)
                }
            }
        });


        if (event_ids.length > 0) {
            //var ev_url = 'https://graph.facebook.com/' + ev_id + '?fields=name&method=GET&format=json&suppress_http_code=1&access_token=' + token
            // was 117370968285365|5XkqBE8fUp29ZaTRAMTmAAfCFvk
            var ev_url =
            'https://graph.facebook.com/fql?q=select eid, location, end_time, start_time, name from event where eid in (' + event_ids.join(',') + ')&format=json&suppress_http_code=1&access_token=' + token

            ////console.log(ev_url)
            $.getJSON(ev_url, function (ev_json) {
                ////console.log(ev_json)
                //html += 'Evnet Title : ' + ev_json.data[0].name + '<br />'
                events = ev_json
            });
        }


        //loop through and within data array's retrieve the message variable.
        $.each(posts, function (i, fb) {

            //var splitID = fb.id.split("_");
            var link = '';
            var splitID = []
            splitID[1] = fb.actor_id;
            if (fb.attachment["href"]) {
                link = fb.attachment["href"];
            } else if (fb.attachment["media"] && fb.attachment["media"][0] && fb.attachment["media"][0]["href"]) {
                link = fb.attachment["media"][0]["href"];
            } else {
                link = fb.permalink;
            }
            html += "<li class='linked fbRow fbRowCollapsed fbRowHover " + fb.actor_id + "'>";

            html += "<div class='fbClose fbExpanded' style='float:right'><img style='width:15px;height:8px; margin-left:3px; opacity: 0.5; filter: alpha(opacity=50);' src='/core/elements/arrows/olive-down.gif' alt='less' /></div>";

            html += "<div class='fbOpen fbCondensed' style='float:right'><img style='width:10px;height:10px' src='/core/elements/arrows/next-sm.gif' alt='more' /></div>";
            /*
            if (!fb.from.category) {
            html += "<img style='float:left; margin-right:4px' src='https://graph.facebook.com/" + fb.from.id + "/picture' alt='' />";
            }
            */
            if (fb.attachment["media"] && fb.attachment["media"][0] && fb.attachment["media"][0]["src"]) {

                html += "<a onclick='goPage(\"" + fb.permalink + "\",event);' href='" + fb.permalink + "'><img class='newsImage newsImageSm fbCondensed' src='" + fb.attachment["media"][0]["src"] + "' alt='' /></a>";

                html += "<a onclick='goPage(\"" + fb.permalink + "\",event);' href='" + fb.permalink + "'><img class='newsImage fbExpanded' src='" + fb.attachment["media"][0]["src"] + "' alt='' /></a>";
            }

            html += "<div class='newsText'>";
            if (fb.created_time) {
                var startDate = new Date(formatFBTimestamp(fb.created_time));
                var startDateString = formatDate(startDate);
                var author = "";
                $.each(users, function(i, user) {
                    if (user.id == fb.actor_id) {
                        if (fb.actor_id != "129055803796451") {
                            // author = " .  By <a href='" + user.url + "'>" + user.name + "<a/>";
                        } else {
                            author = " .  By " + user.name;
                        }
                        return false;
                    }
                });
                
                html += '<div class="postDate">Posted ' + startDateString +  author + '</div>';
            }
            if (fb.attachment["name"]) {
                fbname = fb.attachment["name"];
                if (fb.attachment["name"].indexOf(" ") == -1 && fb.attachment["name"].length > 40) {
                    if (fb.attachment["name"].length < 80) {
                        fbname = fb.attachment["name"].substring(0, 40) + '<br />' + fb.attachment["name"].substring(41);

                    } else {
                        fbname = '';
                    }
                }
                if (fbname.length > 0) {
                    if (fb.attachment["href"]) {
                        html += "<div class='newsfeedTitle'><a href='" + fb.attachment["href"] + "'>" + fbname + "</a></div>";
                    } else {
                        html += "<div class='newsfeedTitle'><a href='https://www.facebook.com/" + fbFolder + "'>" + fbname + "</a></div>";
                    }
                }
            }

            if (fb.message) {
                //if (fb.attachment["name"].length <= 0) {
                if (fb.attachment.hasOwnProperty("name") == false) {
                    html += "<div class='newsfeedTitle noneVerbose'><a href='" + link + "'>" + fb.message.substr(0, 100) + "</a></div>";
                } else if (fb.attachment["name"] != fb.message) {
                    html += "<div>" + fb.message.substr(0, 350);
                    if (fb.message.length > 351) {
                        html += " <a href='" + fb.permalink + "'>more...</a>";
                    }
                    html += "</div>";
                }
            }

            if (fb.attachment["description"] || fb.attachment["caption"] || fb.description) {
                if (fb.attachment["caption"] && fb.attachment["caption"].length > 250) {
                    html += "<div class='newsfeedDesc fbExpanded'>";
                } else {
                    html += "<div class='newsfeedDesc fbExpanded' style='overflow:hidden'>";
                }
                if (fb.attachment["caption"]) {
                    html += fb.attachment["caption"].substr(0, 500);
                }
                if (fb.attachment["description"]) {
                    if (fb.attachment["caption"]) {
                        html += " - ";
                    }
                    html += fb.attachment["description"].replace(fb.name, "").substr(0, 500);
                } else if (fb.description) {
                    if (fb.attachment["caption"]) {
                        html += " - ";
                    }

                    if (fb.attachment["media"] && fb.attachment["media"][0] && fb.attachment["media"][0]["type"] && fb.attachment["media"][0]["type"] == "link") {

                        //console.log(fb.attachment["media"][0]["href"])
                        ev_id_array = fb.attachment["media"][0]["href"].split('/')

                        ev_id = ev_id_array[ev_id_array.length - 2]

                        if (parseInt(ev_id) == ev_id) {
                            //event_ids.push(ev_id)

                            $.each(events.data, function (ei, event) {
                                if (event.eid == ev_id) {
                                    html += "<div class='newsfeedTitle'><a href='" + link + "'>" + event.name + "</a></div>";
                                    if (event.location) {
                                        html += '<b>Where:</b> ' + event.location + '<br />';
                                    }
                                    var start_time = event.start_time;
                                    var end_time = event.end_time;
                                    if (event.start_time == null) {
                                        start_time = event.start_time * 1000;
                                    }
                                    if (event.end_time == null) {
                                        end_time = event.end_time * 1000;
                                    }
                                    html += '<b>When:</b> ' + formatDateTicks(start_time, end_time) + '<br />';
                                    events.data.remove(ei);
                                    return false;
                                }
                            });
                        }
                    }
                    html += fb.description.replace(fb.attachment["name"], "").substr(0, 500);
                }
                html += "</div>";
            }
            // Comments
            // Only summary of comments is displayed, just like facebook default, only 2 available unless you "read more" or "view all"... 
            // the graph call for "view all comments" is get the post ID of that post and append "/comment"...
            // example:
            // FEED: https://graph.facebook.com/161439580553446/feed
            // A POST FROM THE FEED: https://graph.facebook.com/161439580553446_177522428945161
            // VIEW ALL COMMENTS: https://graph.facebook.com/161439580553446_177522428945161/comments



            // COMMENTS
            if (showComments) {

                // check if comments for this post exists or not
                if (fb.comment_info) {
                    //commentCount = 0;
                    html += "<div class='fbComments fbExpanded'>";

                    if (fb.comment_info.comment_count > 3) {
                        html += "<a class='addComment commentIcon' href='" + fb.permalink + "'>View all " + fb.comment_info.comment_count + " comments / Add comment</a><br />";
                    } else {
                        html += "<a class='addComment commentIcon' href='" + fb.permalink + "'>Add comment</a> | <a class='addComment' href='" + fb.permalink + "'>View details</a><br />";
                    }

                    html += "</div>"; // end .newsText
                    html += '<div style="clear:both"></div>';
                    //alert(commentQuantity);
                    $.each(comments, function (i, theComments) {

                        if (theComments.post_id == fb.post_id) {
                            commentCount++;

                            if (commentQuantity >= commentCount) {
                                //console.log(theComments);

                                data = theComments

                                //if (i == "data") {
                                // $.each(theComments, function (i, data) {

                                data.text = data.text.replace(new RegExp("\\n", "g"), "<br />");

                                var URLregex = new RegExp();
                                URLregex.compile("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))", "g");

                                data.text = data.text.replace(URLregex, ' <a href="$2" target="_blank">view link</a> ');

                                //var DOMAINregex = new RegExp();
                                //DOMAINregex.compile(">https?://(?:www\.)?([^/]+)","g");
                                //data.message = data.message.replace(DOMAINregex, '>Visit link on $1');

                                html += "<div onclick='goPage(\"" + fb.permalink + "\",event);' class='comment fbExpanded'><img class='commentImage' src='https://graph.facebook.com/" + data.fromid + "/picture' alt='' />";
                                html += data.text + "<br />";
                                if (data.timetime) {
                                    var startDate = new Date(formatFBTime(data.time));
                                    //var startDateString = days[startDate.getDay()] + ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
                                    html += '<span class="commentDate">Posted ' + formatDate(startDate) + '</span><br />';
                                }

                                html += "</div><div style='clear:both'></div>";
                                //});
                            }
                        }

                    });
                    html += "</div>";
                    commentCount = 0;
                } else {
                    html += "</div>"; // end .newsText
                    html += '<div style="clear:both"></div>';
                    html += "<a class='addComment' href='" + fb.permalink + "'>Add comment</a><br />";
                }
            } else {
                html += "<a class='addComment commentIcon' href='" + fb.permalink + "'><a class='addComment' href='" + fb.permalink + "'>View details</a><br />";
            }

            //                              if (fb.properties.name) {
            //                                      html += fb.properties.name + "<br />";
            //                              }

            //                                  if (fb.updated_time) {
            //                                      var offset = new Date(fb.updated_time);
            //                                      //var offset = curdate.getTimeZoneOffset();
            //                                      var startDateString = days[offset.getDay()] + ' at ' + offset.getHours() + ':' + offset.getMinutes();
            //                                      //+ ", " + months[offset.getMonth()] + ' ' + offset.getDate() + ', ' + fourdigits(offset.getYear());
            //                                      html += 'Updated ' + startDateString + '</a><br />';
            //                                  }



            html += "<div style='clear:both'></div></li>";
        });
        html += "</ul>";

        // TO DO: Add a variable to show theses
        //html += "<div class='fbDetails button button-grey button-sm' style='margin:10px 10px 10px 0'>Expand Posts</div>";
        //html += "<div class='fbShrink button button-grey button-sm' style='display:none; margin:10px 10px 10px 0'>Shrink Posts</div>";

        //Animate - Fuzzy text with IE8
        //                              $('.newsfeed').animate({ opacity: 0 }, 500, function () {

        //                                  $('.newsfeed').html(html);

        //                              });

        //                              $('.newsfeed').animate({ opacity: 1 }, 500);

        // Temp, no animation

        //$('.newsfeed').html(html); // Overwrites
        $('.newsfeed').append(html);

    });



};
/*
function formatFBTime(fbDate) {
    // For Explorer 8 and Firefox 3
    var arrDateTime = fbDate.split("T");
    var arrDateCode = arrDateTime[0].split("-");
    var strTimeCode = arrDateTime[1].substring(0, arrDateTime[1].indexOf("+"));
    var arrTimeCode = strTimeCode.split(":");
    var valid_date = new Date()
    valid_date.setUTCFullYear(arrDateCode[0]);
    valid_date.setUTCMonth(arrDateCode[1] - 1);
    valid_date.setUTCDate(arrDateCode[2]);
    valid_date.setUTCHours(arrTimeCode[0]);
    valid_date.setUTCMinutes(arrTimeCode[1]);
    valid_date.setUTCSeconds(arrTimeCode[2]);
    return valid_date;
}
*/

function formatFBTimestamp(unix_tm) {
    // For Explorer 8 and Firefox 3
    var dt = new Date(unix_tm*1000);
    
    var valid_date = new Date()
    valid_date.setUTCFullYear(dt.getFullYear());
    valid_date.setUTCMonth(dt.getMonth());
    valid_date.setUTCDate(dt.getDate());
    valid_date.setUTCHours(dt.getHours());
    valid_date.setUTCMinutes(dt.getMinutes());
    valid_date.setUTCSeconds(dt.getSeconds());
    return valid_date;
}
function fourdigits(number) {
    return (number < 1000) ? number + 1900 : number;
}
function showTheHours(theHour) {
    if (theHour > 0 && theHour < 13) {
        if (theHour == "0") theHour = 12;
        return (theHour);
    }
    if (theHour == 0) {
        return (12);
    }
    return (theHour - 12);
}
function showZeroFilled(inValue) {
    if (inValue > 9) {
        return "" + inValue;
    }
    return "0" + inValue;
}
function showAmPm(inDate) {
    if (inDate.getHours() < 12) {
        return (" am");
    }
    return (" pm");
}

$(document).ready(function () {
    $(document).on('click', '.fbDetails', function (e) {
        $('.fbExpanded').show();
        $('.fbCondensed').hide();
        $('.fbRow.fbRowCollapsed').toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
        $('.fbDetails').hide();
        $('.fbShrink').show();
        e.preventDefault();
    });
    $(document).on('click', '.fbShrink', function (e) {
        $('.fbExpanded').hide();
        $('.fbCondensed').show();
        $('.fbRow.fbRowCollapsed').toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
        $('.fbShrink').hide();
        $('.fbDetails').show();
        e.preventDefault();
    });

    $('.newsfeed').click(function (event) {


        if (event.isDefaultPrevented()) {
            return false; // click hander called again due to event bubbling. If already handled, just return.
        }

        var $eventTarget = $(event.target);

        if ($eventTarget.is("a")) {
            return true; // follow the url
        }

        var $parent = $eventTarget.closest('.fbRow');
        if ($parent.length > 0) {
            
            if (!$parent.hasClass('fbRowCollapsed')) {
                $('.fbExpanded', $parent).hide();
                $('.fbCondensed', $parent).show();
                $parent.toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from expanded to collapsed
                $parent.addClass('fbRowHover');
            } else {
                $('.fbExpanded', $parent).show();
                $('.fbCondensed', $parent).hide();
                $parent.toggleClass('fbRowCollapsed fbRowExpanded'); // toggle row from collapsed to expanded
                $parent.removeClass('fbRowHover');
            }
            event.preventDefault();
        }
    });
});
 $(document).ready(function () {
            token = '117370968285365|5XkqBE8fUp29ZaTRAMTmAAfCFvk';
            //showComments = false;
            fbLimit = 10;
            fbOffset = 0;
            //fbFolder = 'RethinkAtlanta';
            //fbFolder = 'GrantParkGPNA';
            // fbFolder = 'Test.Goverment.Page.1751330211762252';
            fbFolder = 'southeast.atlanta';
            // fbFolder = 'Atlanta-City-Council-Member-Carla-Smith-285182178269780';
            // fbFolder = '285182178269780';
            // actor_id = '';
            // pubfeedfql = 'and actor_id in (select page_id from page where username=\''+fbFolder+'\')';
            
            //fbFolder = 'georgiastateparks';
            //fbFolder = 'GlenwoodParkAtlanta';
            fbFetch(token); // Access token from Neighborhood App.
            admin_actor_id_class = ".129055803796451";
            
            
            $("#loadMoreFbFeeds").click(function() {
                fbOffset = fbLimit + fbOffset;
                fbFetch(token); // Access token from Neighborhood App.
            });
            $(".fbShowPublicPosts").click(function() {
                includePublicFeed = true;
                Cookies.set('NCA_includePublicFeed', true);
                $("li").not(admin_actor_id_class).show();
                $("#loadMoreFbFeeds").click();
                $(".fbShowPublicPosts").hide();
                $(".fbHidePublicPosts").show();
            });
            $(".fbHidePublicPosts").click(function() {
                includePublicFeed = false;
                Cookies.set('NCA_includePublicFeed', false);
                // $("#loadMoreFbFeeds").click();
                $("li").not(admin_actor_id_class).hide();
                $(".fbHidePublicPosts").hide();
                $(".fbShowPublicPosts").show();
            });
            
            
            if (includePublicFeed == "true") {
                console.log(includePublicFeed);
                $(".fbShowPublicPosts").hide();
                $(".fbHidePublicPosts").show();
            }
            
            
        });
function goPage(page,e) {
    window.location=page;
    e.preventDefault();
}


