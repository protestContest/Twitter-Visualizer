$(document).ready(function() {
	var cur_label;
	var spotters = [10];

	init_spotters(spotters);

	$('button').click(function() {
		cur_label = $(this).parent().children('.tag-header');
		$('#name_header').text(cur_label.text());
		$('#modal-input').val(cur_label.text());
	});

	$('.modal-footer .btn.primary').click(function() {
		var modal_input = $('#modal-input');
		cur_label.text(modal_input.val());
		$('#modal-from-dom').modal('hide');
	});

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

function registerTweets(s, i, query) {
	// var tweetarr = [];
	// var numtweets = 0;
	
	s.register(function(tweet) {
		var new_tweetbox = $("<div class=tweetbox>"+ tweet.text +"</div>");
		if (i === 9)
			new_tweetbox.addClass('last');
		else
			new_tweetbox.css('left', Math.floor(i*$(window).width()*0.1));
		
		s.tweets.push(new_tweetbox);

		var dh = Math.round($(document).height() - $('#info-row').height() - 10*s.tweets.length + 10);

		new_tweetbox.appendTo($('.content')).animate({
			top: '+=' + dh
		});

		if (new_tweetbox.position().left + 300 > $(window).width())
			new_tweetbox.addClass('rightedge');


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