$(document).ready(function() {
	var cur_label;

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
