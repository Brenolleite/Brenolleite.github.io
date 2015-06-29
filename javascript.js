$(function() {
    $('.click').click( function(event) {
	var $this = $(this);
        event.preventDefault();
        $('#main-wrapper').load($this.attr('href'));
	return false;
    });
});
