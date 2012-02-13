var spotters = [10];
$(document).ready(function() {
	var cur_label;	// based on last button pressed
	var cur_col;	// based on last button pressed
	

	// sets up default spotters
	init_spotters(spotters);

	// brings up modal with info of clicked cell
	$('button').click(function() {
		cur_label = $(this).parent().children('.tag-header');
		cur_col = $(this).parent().index();
		$('#name_header').text(cur_label.text());
		$('#modal-input').val(cur_label.text());
	});

	// changes column info according to modal
	$('.modal-footer .btn.primary').click(function() {
		var modal_input = $('#modal-input');
		cur_label.text(modal_input.val());

		// stop the previous spotter handling this column
		spotters[cur_col].stop();

		// // make a new one
		spotters[cur_col] = new Spotter("twitter.search",
			{q:modal_input.val(), period:10},
			{buffer:true, bufferTimeout:1000});

		spotters[cur_col].query = modal_input.val();
		spotters[cur_col].tweets = [];
		spotters[cur_col].count = 0;
		spotters[cur_col].maxed = false;
		spotters[cur_col].maxtweets = Math.floor(0.1 * ($(document).height() - $('#info-row').height())) - 5;

		registerTweets(spotters[cur_col], cur_col, modal_input.val());
		spotters[cur_col].start();

		// clear the column
		$('.col' + cur_col).remove();

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
			{q:query, period:10},
			{buffer:true, bufferTimeout:1000});
			
		spotters[i].query = query;
		spotters[i].tweets = [];
		spotters[i].count = 0;
		spotters[i].maxed = false;
		spotters[i].maxtweets = Math.floor(0.1 * ($(document).height() - $('#info-row').height())) - 5;
			
		registerTweets(spotters[i], i, spotters[i].query);
		spotters[i].start();
	}
}

//  deals with incoming tweets
function registerTweets(s, i, query) {
	
	s.register(function(tweet) {
		var query = $('.tag-header')[i].textContent;
		if (s.query != query)
			return;

		s.count++;

		// makes new  box representing tweet
		var new_tweetbox = $("<div class='tweetbox col" + i + "'>"+ tweet.text +"</div>");
		
		// add tweet to our internal array		
		s.tweets.push(new_tweetbox);

		var dh = Math.round($(document).height() - 
			$('#info-row').height() - 10*s.tweets.length + 10);
		dh = $('#info-row').height();

		new_tweetbox.css('bottom', $(window).height() + 20 + 'px');
		// add tweetbox and slide it down to position
		new_tweetbox.appendTo($('.content')).animate({
			bottom: $('#info-row').height() + 10*s.tweets.length - 10 + 'px'
		}, 3000);

		var left = new_tweetbox.position().left;

		// register some rightedge stuff, so it doesn't go off the screen
		if (left + 310 > $(window).width()) {
			new_tweetbox.addClass('rightedge');
		}

		// limit tweets to what can fit on the screen
		if (s.tweets.length > s.maxtweets) {
			$('.col' + i).animate({
				bottom: '-=10' + 'px'
			});
			lastTweet = s.tweets.shift();
			lastTweet.remove();

			// show counter if it isn't shown
			if (!s.maxed) {
				s.maxed = true;
				$($('.counter')[i]).css('visibility', 'visible');
			}
			$($('.counter')[i]).text(s.count);
		}


	});
}
