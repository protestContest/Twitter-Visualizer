var spotters = [10];
var dates = [];

$(document).ready(function() {
	var cur_label;	// based on last button pressed
	var cur_col;	// based on last button pressed
	
	// sets up default spotters
	init_spotters(spotters);

	// show about modal initially, hide after some seconds
	$('#about-modal').modal('show');
	setTimeout("$('#about-modal').modal('hide');", 20000);

	/***** CALLBACKS *****/

	// brings up modal with info of clicked cell
	$('button').click(function() {
		cur_label = $(this).parent().children('.tag-header');
		cur_col = $(this).parent().index();
		$('#name_header').text(cur_label.text());
		$('#modal-input').val(cur_label.text());
	});

	// brings up about modal
	$('#about-button').click(function() {
		$('#about-modal').modal('show');
	});

	// changes column info according to modal
	$('#modal-from-dom .modal-footer .btn.primary').click(function() {
		var modal_input = $('#modal-input');
		cur_label.text(modal_input.val());

		// stop the previous spotter handling this column
		spotters[cur_col].stop();

		// make a new one
		spotters[cur_col] = new Spotter("twitter.search",
			{q:modal_input.val(), period:10, lang:"en"},
			{buffer:true, bufferTimeout:1000});

		spotters[cur_col].tweets = [];	// holds actual tweets
		spotters[cur_col].count = 0;	// total tweets received
		spotters[cur_col].maxed = false;	// whether the column is full
		// number of tweets that would fill the column
		spotters[cur_col].maxtweets = Math.floor(0.1 * ($(document).height() - $('#info-row').height())) - 2;
		spotters[cur_col].date = new Date();	// checked to make sure we show the right tweets

		// updates global array for checking later
		dates[cur_col] = spotters[cur_col].date;

		// hide the counter if it's visible
		$($('.counter')[cur_col]).css('visibility', 'hidden');

		// set up to handle incoming tweets
		registerTweets(spotters[cur_col], cur_col, modal_input.val());
		spotters[cur_col].start();

		// clear the column
		$('.col' + cur_col).remove();

		$('#modal-from-dom').modal('hide');
	});
	// change modal cancel button
	$('#modal-from-dom .btn.cancel').click(function() {
		$('#modal-from-dom').modal('hide');
	});

	// about reset button
	$('#about-modal .btn.secondary').click(function() {
		reset_spotters(spotters);
		$('#about-modal').modal('hide');
	});
	// about close button
	$('#about-modal .btn.primary').click(function() {
		$('#about-modal').modal('hide');
	})

});

// set up spotters with defaults
function init_spotters(spotters) {
	for (var i = 0; i < 10; i++) {
		// grab query from header in DOM
		var query = $('.tag-header')[i].textContent;

		spotters[i] = new Spotter("twitter.search",
			{q:query, period:10, lang:"en"},
			{buffer:true, bufferTimeout:1000});
			
		spotters[i].tweets = [];	// holds actual tweets
		spotters[i].count = 0;		// total tweets received
		spotters[i].maxed = false;	// whether column is full
		// maximum number of tweets that will fit in one column
		spotters[i].maxtweets = Math.floor(0.1 * ($(document).height() - $('#info-row').height())) - 2;
		spotters[i].date = new Date();	// used to make sure only current tweets are displayed

		// update global array to check tweet freshness
		dates[i] = spotters[i].date;

		// counters start hidden
		$('.counter').css('visibility', 'hidden');
			
		// set up to handle incoming tweets
		registerTweets(spotters[i], i, spotters[i].query);
		spotters[i].start();

		// clear the column in case there's anything there
		$('.col' + i).remove();
	}
}

function reset_spotters(spotters) {
	for (var i = 0; i < 10; i++) {
		spotters[i].stop();
	}
	init_spotters(spotters);
}

//  deals with incoming tweets
function registerTweets(s, i, query) {
	
	s.register(function(tweet) {
		// checks to make sure these tweets are from the current spotter,
		// not a stale one we've stopped
		if (s.date != dates[i])
			return;

		// keep a count of total tweets received
		s.count++;

		// makes new  box representing tweet
		var new_tweetbox = $("<div class='tweetbox col" + i + "'>"+ tweet.text +"</div>");
		
		// add tweet to our internal array		
		s.tweets.push(new_tweetbox);

		// position tweetbox above visible screen initially
		new_tweetbox.css('bottom', $(window).height() + 20 + 'px');

		// add tweetbox and slide it down to position
		new_tweetbox.appendTo($('.content')).animate({
			bottom: $('#info-row').height() + 10*s.tweets.length - 10 + 'px'
		}, 3000);

		// check if hovering would cause tweet to go off screen.. deal with it in css
		var left = new_tweetbox.position().left;
		if (left + 310 > $(window).width()) {
			new_tweetbox.addClass('rightedge');
		}

		// if the column is full, we have to slide things down and move the counter
		if (s.tweets.length > s.maxtweets) {
			// slide down
			$('.col' + i).animate({
				bottom: '-=10' + 'px'
			});
			// throw away tweet
			lastTweet = s.tweets.shift();
			lastTweet.remove();

			// show counter if it isn't shown
			if (!s.maxed) {
				s.maxed = true;
				$($('.counter')[i]).css('visibility', 'visible');
			}

			// update counter text
			$($('.counter')[i]).text(s.count);

			// move counter up stack
			if (s.maxed) {
				// maximum height counter can go - leaves space for a few tweetboxes
				var maxheight = $(window).height() - 80;

				// 10 px for every screen of tweets
				var bottom = Math.floor((s.count/(0.1*s.maxtweets) + $('#info-row').height() ));

				if (bottom < maxheight)
					$($('.counter')[i]).css('bottom', bottom + 'px');
				else
					$($('.counter')[i]).css('bottom', maxheight + 'px');
			}
		}


	});
}
