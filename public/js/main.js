
window.fbAsyncInit = function() {
    var result = FB.init({
        appId       : '582329818791668',
        xfbml       : true,
        status      : true, 
        cookie      : true,
        oauth       : true,
        version     : 'v3.0'
    });
    FB.AppEvents.logPageView();
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function logoutFacebook() {
    FB.logout(function(response) {
        location.href="./signin";
    });
}

$(document).ready(function() {
    $('.sidenav').sidenav();
    $('.tabs').tabs({swipeable:false});
    resizeTabContent();    
    
    $('.modal-trigger').click(function(){ 
        var el = $(this);
        $(".modal-content").html('<div class="preloader-wrapper small active center-align" style="margin-top:120px"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
        $('#save_team_button').html('Select your favorite team')
        $.get( el.attr('data-source'), function( data ) {
            $( ".modal-content" ).html(data);
        });
    });
    $('.modal').modal();
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
    $("#popup_content").html('').load('/player?player_id='+id+'&token='+getParameterByName('token'),'', function() {
        $.LoadingOverlay("hide");
    });
}

function showMatchPopup(el,match_no) {
	$('#popup_page').show().removeClass('slideOutLeft').addClass('slideInLeft');
	var index = $("#schedule_tab div.list-row").index( el );
    $('#popup_page a.brand-logo').html('Match Detail'); 
    $.LoadingOverlay("show");
    $("#popup_content").html('').load('/match?match_no='+match_no+'&token='+getParameterByName('token'),'',function() {
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
            },
            error: function(data){
                err = JSON.parse(data.responseText);
                M.toast({html: err.error.message , classes: 'rounded'});
                $.LoadingOverlay("hide");
            }
        });
    }
}

function selectTeam(el,team,team_name) {
    $('.choose-team').removeClass('team-selected');
    $(el).addClass('team-selected');
    $('#save_team_button').html('Save <b>' + team_name + '</b> as favorite');
    $('#fav_team').val(team);
}

function saveFavTeam() {
    $.LoadingOverlay("show");
    
    $.ajax({
        url: "/api/players",
        type: 'post',
        data: {                
            fav_team: $('#fav_team').val()
        },
        headers: {
            "x-access-token": getParameterByName('token')
        },
        dataType: 'json',
        success: function(result) {                
            $.LoadingOverlay("hide");
            M.toast({html: 'Your team is saved', classes: 'rounded'});
            $('#player_info').css("background","-webkit-linear-gradient(top, rgba(255, 255, 255, 1) 0%, rgba(255,255,255, 0.7) 100%), url(/images/"+$('#fav_team').val()+".png) repeat 100% 0");
            closePopup();
        },
        error: function(data){
            err = JSON.parse(data.responseText);
            M.toast({html: err.error.message , classes: 'rounded'});
            $.LoadingOverlay("hide");
        }
    });
}

function postComment(match_no) {
    if (!$('#comment_message').val()) return;

    $.LoadingOverlay("show");
    $.ajax({
        url: "/api/comments",
        type: 'post',
        data: {                
            match_no: match_no,
            message: $('#comment_message').val()
        },
        headers: {
            "x-access-token": getParameterByName('token')
        },
        dataType: 'json',
        success: function(result) {
            $('#comment_message').val('');
            $("#comment_history").load('/comment?match_no='+match_no+'&token='+getParameterByName('token'),'', function() {
                $.LoadingOverlay("hide");
            });
        },
        error: function(data){
            err = JSON.parse(data.responseText);
            M.toast({html: err.error.message , classes: 'rounded'});
            $.LoadingOverlay("hide");
        }
    });
}
  
