lastLink = undefined

$(function() {
    $('.click').click( function(event) {
	var $this = $(this);
        event.preventDefault();
        $('#main-wrapper').load($this.attr('href'));
	if(lastLink){
	    lastLink.removeClass('active');
	}
	lastLink = $this;
	$this.addClass('active');
	return false;
    });
});
