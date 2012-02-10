$(document).ready(function() {
	$('button').click(function() {
		$('#change-tag').slideDown();

		var cell = $(this).parent();
		console.log($(this).parent().children('.tag-header'));
	});
});