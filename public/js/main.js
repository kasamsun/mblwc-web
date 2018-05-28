
$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.tabs').tabs({swipeable:false});
    resizeTabContent();
});

function resizeTabContent() {
    var navHeight = $('.nav-extended').height();
    $('#ranking_tab').height(window.innerHeight-navHeight);
    $('#schedule_tab').height(window.innerHeight-navHeight);
    $('#standing_tab').height(window.innerHeight-navHeight);
}

function showPlayerPopup(el,id) {
	$('#popup_page').show().removeClass('slideOutLeft').addClass('slideInLeft');
	var index = $("#ranking_tab div.list-row").index( el );
	
	$('#popup_content').html('player information with result');
}

function showMatchPopup(el,id) {
	$('#popup_page').show().removeClass('slideOutLeft').addClass('slideInLeft');
	var index = $("#schedule_tab div.list-row").index( el );
	$('#popup_content').html('match result with entry data');
}

function closePopup() {
	$('#popup_page').removeClass('slideInLeft').addClass('slideOutLeft');
}

  
  
  
  
