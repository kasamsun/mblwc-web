
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
    $('#popup_page a.brand-logo').html('Player Detail');    
    $.LoadingOverlay("show");
    $("#popup_content").load('/player?player_id='+id+'&token='+getParameterByName('token'),'', function() {
        $.LoadingOverlay("hide");
    });
}

function showMatchPopup(el,match_no) {
	$('#popup_page').show().removeClass('slideOutLeft').addClass('slideInLeft');
	var index = $("#schedule_tab div.list-row").index( el );
    $('#popup_page a.brand-logo').html('Match Detail'); 
    $.LoadingOverlay("show");
    $("#popup_content").load('/match?match_no='+match_no+'&token='+getParameterByName('token'),'',function() {
        $.LoadingOverlay("hide");
        $('select').formSelect();        
    });
}

function closePopup() {
	$('#popup_page').removeClass('slideInLeft').addClass('slideOutLeft');
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function saveScore(match_no) {
    var home_score = $('#input_home_score').val();
    var away_score = $('#input_away_score').val();
    if (
        home_score===null || away_score===null ||
        home_score.length===0 || away_score.length===0) {
        M.toast({html: 'Please put valid scores', classes: 'rounded'});

    } else {        
        $.LoadingOverlay("show");
        $.ajax({
            url: "/api/results",
            type: 'post',
            data: {                
                match_no: match_no,
                home_score: home_score,
                away_score: away_score
            },
            headers: {
                "x-access-token": getParameterByName('token')
            },
            dataType: 'json',
            success: function(result) {                
                $.LoadingOverlay("hide");
                $('#schedule_tab .list-row:eq('+(result.match_no-1)+') .match-result .player-input-score').html(
                    result.home_score + ' - ' + result.away_score
                );
                M.toast({html: 'Your score is saved', classes: 'rounded'});
                closePopup();
            }
        });
    }
}
  
  
  
