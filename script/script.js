$(document).ready(function() {
	var cur_label;
	var spotters = [10];

	// sets up default spotters
	init_spotters(spotters);

	// brings up modal with info of clicked cell
	$('button').click(function() {
		cur_label = $(this).parent().children('.tag-header');
		$('#name_header').text(cur_label.text());
		$('#modal-input').val(cur_label.text());
	});

	// changes column info according to modal
	$('.modal-footer .btn.primary').click(function() {
		var modal_input = $('#modal-input');
		cur_label.text(modal_input.val());
		$('#modal-from-dom').modal('hide');
	});

	// closes modal
	$('.modal-footer .btn.cancel').click(function() {
		$('#modal-from-dom').modal('hide');
	});

});

function init_spotters(spotters) {
	for (var i = 0; i < 10; i++) {
		var query = $('.tag-header')[i].textContent;

		spotters[i] = new Spotter("twitter.search",
			{q:query, period:100},
			{buffer:true, bufferTimeout:1000});
		spotters[i].tweets = [];
		spotters[i].maxtweets = Math.floor(0.1 * ($(document).height() - $('#info-row').height()));
			
		registerTweets(spotters[i], i, query);
		spotters[i].start();
	}
}

//  deals with incoming tweets
function registerTweets(s, i, query) {
	// var tweetarr = [];
	// var numtweets = 0;
	
	s.register(function(tweet) {
		// makes new  box representing tweet
		var new_tweetbox = $("<div class=tweetbox>"+ tweet.text +"</div>");

		if (i === 9)
			new_tweetbox.addClass('last');
		else
			new_tweetbox.css('left', Math.floor(i*$(window).width()*0.1));
		
		// add tweet to our internal array		
		s.tweets.push(new_tweetbox);

		var dh = Math.round($(document).height() - 
			$('#info-row').height() - 10*s.tweets.length + 10);
		dh = $('#info-row').height();

		new_tweetbox.css('bottom', '1000px');
		// add tweetbox and slide it down to position
		new_tweetbox.appendTo($('.content')).animate({
			bottom: $('#info-row').height() + 10*s.tweets.length - 10 + 'px'
		});

		var left = new_tweetbox.position().left;

		// register some rightedge stuff, so it doesn't go off the screen
		if (left + 300 > $(window).width()) {
			new_tweetbox.addClass('rightedge');

			$('.rightedge:not(.last)').hover(function() {
				$(this).css('left', '');
				$(this).css('right', '0px');
			},
			function() {
				$(this).css('right', '');
				$(this).css('left', left + 'px');
				console.log($(this).css('left'));
			});
		}

		// limit tweets to what can fit on the screen
		if (s.tweets.length > s.maxtweets) {
			lastTweet = s.tweets.shift();
			lastTweet.slideUp(function() {
				lastTweet.remove();
			});
		}

		// console.log(tweet.text);
	
		// only add stuff if this query (q) is the current query (query)
		// if (q === query) {
		// 	var profile_img = "<img class=profilepic src='" + tweet.profile_image_url + "' alt='profile image' />";

		// 	// every other tweet in 'stripe' class, different background
		// 	if (numtweets % 2 === 0)
		// 		var stripe = 'stripe1';
		// 	else
		// 		var stripe = 'stripe2';

		// 	// add tweet to page (and array)
		// 	tweetarr.push(
		// 		$("<div class='tweet " + stripe + " " + q + "'>" 
		// 				+ profile_img 
		// 				+ " <a href='http://www.twitter.com/#!/" + tweet.from_user + "'>" + tweet.from_user_name + ":</a> " 
		// 				+ tweet.text + "</div>")
		// 			.prependTo($("#tweets"))
		// 			.hide()
		// 			.slideDown()
		// 	);

		// 	numtweets++;
			
		// 	// limit to 10 tweets, throw away last one
		// 	if (tweetarr.length > 10) {
		// 		lastTweet = tweetarr.shift();
		// 		lastTweet.slideUp(function() {
		// 			lastTweet.remove();
		// 		});
		// 	}
		// }
	});
}