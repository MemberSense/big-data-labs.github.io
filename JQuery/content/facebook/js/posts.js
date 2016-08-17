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
var nextfeedurl = '';
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
    
    

	var url = '';
	if (nextfeedurl == '') {
        url = "https://graph.facebook.com/" + fbFolder + "/feed?access_token=" + token + "&limit=" + fbLimit + "&callback=?";
    } else {
        url = nextfeedurl + "&callback=?";
    }
	//Use jQuery getJSON method to fetch the data from the url and then create our unordered list with the relevant data.
	$.getJSON(url, function (json) {
		var html = "<ul>";
	    var commentCount = 0;

	    // These aren't working...
	    if (!showComments) {
	    	// Wrap newsText under thumbnail.  Allows for irregualar thumbnail widths, which look odd when comments don't separate.
		    $('.newsText').attr('style', 'overflow: visible;');
	    }
	    if (showComments) {
	    	$('.newsText').attr('style', 'overflow:hidden;');
	    }
        if(typeof json.paging != 'undefined' && typeof json.paging.next != 'undefined') {
            nextfeedurl = json.paging.next;
        }
        

	    //loop through and within data array's retrieve the message variable.
	    $.each(json.data, function (i, fb) {
            
            
            // console.log('i=> ' + i)
            // console.log('fb=> ' + JSON.stringify(fb))
	        var splitID = fb.id.split("_");
            
            var liclass = fb.from.id;
            var displaycss = (!includePublicFeed && fbAdminID != '' && fb.from.id != fbAdminID  ? "style='display: none;'" : "");
            
			if (fb.link) {
	            html += "<li class='linked " + liclass + "' " + displaycss + " onclick='javascript:document.location=\"" + fb.link + "\"'>";
	        } else if (showComments) {
				html += "<li class='linked " + liclass + "' " + displaycss + "  onclick='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "\"'>";
			} else {
	            html += "<li class='linked " + liclass + "' " + displaycss + " onclick='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "\"'>";
	        }
			
	        if (!fb.from.category) {
	            html += "<img style='float:left; margin-right:4px' src='https://graph.facebook.com/" + fb.from.id + "/picture' alt='' />";
	        }

	        if (fb.picture) {
	            html += "<img class='newsImage' src='" + fb.picture + "' alt='' />";
	        }

	        html += "<div class='newsText'>";
	        if (fb.created_time) {
	        	var startDate = new Date(formatFBTime(fb.created_time));
	            var startDateString = formatDate(startDate);
	            html += '<div class="postDate">Posted ' + startDateString + '</div>';
	        }
	        if (fb.name) {
				fbname = fb.name;
	            if (fb.name.indexOf(" ") == -1 && fb.name.length > 40) {
					if (fb.name.length < 80)
					{
						fbname = fb.name.substring(0,40) + '<br />' + fb.name.substring(41);
						
					} else {
						fbname = '';
					}
				}
				if (fbname.length > 0) {
					if (fb.link) {
						//html += "<div class='newsfeedTitle'><a href='javascript:document.location=\"" + fb.link + "\"'>" + fbname + "</a></div>";
						html += "<div class='newsfeedTitle'><a href='" + fb.link + "'>" + fbname + "</a></div>";
					} else {
						//html += "<div class='newsfeedTitle'><a href='javascript:document.location=\"https://www.facebook.com/" + fbFolder + "\"'>" + fbname + "</a></div>";
						html += "<div class='newsfeedTitle'><a href='https://www.facebook.com/" + fbFolder + "'>" + fbname + "</a></div>";
					}
				}
	        }
	        
	        if (fb.message) {
	            html += "<div >" + fb.message.substr(0,350);
	            if (fb.message.length > 351) {
	            	html += " <strong>more...</strong>";
	            }
	            html += "</div>";
	        }
			
	        if (fb.description || fb.caption || fb.story) {
	        	if (fb.caption && fb.caption.length > 250) {
	        		html += "<div class='newsfeedDesc'>";
	        	} else {
	        		html += "<div class='newsfeedDesc' style='overflow:hidden'>";
	        	}
		        if (fb.caption) {
		            html += fb.caption.substr(0,500);
		        }
		        if (fb.description) {
		        	if (fb.caption) {
			            html += " - ";
			        }
		        	html += fb.description.replace(fb.name, "").substr(0,500);
		        } else if (fb.story) {
		        	if (fb.caption) {
			            html += " - ";
			        }
                    // get event title
                    //https://graph.facebook.com/462861550460081?fields=name&method=GET&format=json&suppress_http_code=1&access_token=CAACEdEose0cBAM9GwZCZC6pvemsc0BP5xrA5uIS0pQWFAcatKeIN6U9bZCwsY75A1yTqpt4BVCSi9cKiXhqDQ6PfeedO5w2wdF0TB8cskwY9ZBSr5Xtp5SFjZBaiaH2BbmHeJcgBZBcR54UEURiZBVOrlwG0gnDZAF3KzkHpZAxaZB7SuY6OXY6diFZA1JvCJupbv55ZCVZAosgsLggZDZD
                    if(fb.type == 'link') {
                        
                        ev_id_array = fb.link.split('/')
                        ev_id = ev_id_array[ev_id_array.length - 2]
                        
                        
                        var ev_url = 'https://graph.facebook.com/' + ev_id + '?fields=name&method=GET&format=json&suppress_http_code=1&access_token=' + token
                        
                        $.getJSON(ev_url, function(ev_json) {
                            html += 'Evnet Title : ' + ev_json.name + '<br />'
                            console.log('Evnet Title : ' + ev_json.name)
                        });
                    }
                    
                    
		        	html += fb.story.replace(fb.name, "").substr(0,500);
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
	            if (fb.comments) {
	            	//commentCount = 0;
	            	html += "<div class='comments'>";
	            	$.each(fb.comments, function (i, theComments) {
	            		if (i == "count") {
	                        if (theComments > 3) {
	                            html += "<a class='addComment commentIcon' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>View all " + theComments + " comments / Add comment</a><br />";
	                        } else {
	                            html += "<a class='addComment commentIcon' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>Add comment</a> | <a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>View details</a><br />";
	                        }
	                    }
	            		
	            	});
	            	html += "</div>"; // end .newsText
	        		html += '<div style="clear:both"></div>';

	                $.each(fb.comments, function (i, theComments) {

	                    if (i == "data") {
	                        $.each(theComments, function (i, data) {

	                            data.message = data.message.replace(new RegExp("\\n", "g"),"<br />");

	                            var URLregex = new RegExp();
								URLregex.compile("(^|[ \t\r\n])((ftp|http|https|gopher|mailto|news|nntp|telnet|wais|file|prospero|aim|webcal):(([A-Za-z0-9$_.+!*(),;/?:@&~=-])|%[A-Fa-f0-9]{2}){2,}(#([a-zA-Z0-9][a-zA-Z0-9$_.+!*(),;/?:@&~=%-]*))?([A-Za-z0-9$_+!*();/?:~-]))","g");
								 
								data.message = data.message.replace(URLregex, ' <a href="$2" target="_blank">view link</a> ');

								//var DOMAINregex = new RegExp();
								//DOMAINregex.compile(">https?://(?:www\.)?([^/]+)","g");
								//data.message = data.message.replace(DOMAINregex, '>Visit link on $1');

	                            html += "<div class='comment'><img class='commentImage' src='https://graph.facebook.com/" + data.from.id + "/picture' alt='' />";
	                            html += data.message + "<br />";
	                            if (data.created_time) {
	                                var startDate = new Date(formatFBTime(data.created_time));
	                                //var startDateString = days[startDate.getDay()] + ' at ' + showTheHours(startDate.getHours()) + ':' + showZeroFilled(startDate.getMinutes()) + ' ' + showAmPm(startDate);
	                                html += '<span class="commentDate">Posted ' + formatDate(startDate) + '</span><br />';
	                            }

	                            html += "</div><div style='clear:both'></div>";
	                        });
	                    }
	                    
	                });
					html += "</div>";
	            } else {
	            	html += "</div>"; // end .newsText
	        		html += '<div style="clear:both"></div>';
	                html += "<a class='addComment' href='https://www.facebook.com/" + fbFolder + "/posts/" + splitID[1] + "'>Add comment</a><br />";
	            }
	        }

	        html += "<div style='clear:both'></div></li>";
	    });
	    html += "</ul>";

	    
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
            // fbFolder = 'southeast.atlanta';
            // fbFolder = 'Atlanta-City-Council-Member-Carla-Smith-285182178269780';
            // fbFolder = '285182178269780';
            // actor_id = '';
            // pubfeedfql = 'and actor_id in (select page_id from page where username=\''+fbFolder+'\')';
            
            //fbFolder = 'georgiastateparks';
            //fbFolder = 'GlenwoodParkAtlanta';
            fbFolder = 'GlenwoodParkAtlanta';
            fbAdminID = '291472227559838';
            fbFetch(token); // Access token from Neighborhood App.
            admin_actor_id_class = ".291472227559838";
            
            
            
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