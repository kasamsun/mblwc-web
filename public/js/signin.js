
window.fbAsyncInit = function() {
    FB.init({
        appId       : '582329818791668',
        xfbml       : true,
        status      : true, 
        cookie      : true,
        oauth       : true,
        version     : 'v3.0'
    });
    FB.AppEvents.logPageView();
    $("#login_button").toggleClass("disabled");
    $("#login_button").addClass("animated");
    window.setTimeout('animate()',5000);
};

var anims = ['swing','tada','jello','rubberBand','bounce'];
function animate() {
    $("#login_button").removeClass(anims.join(" ")).addClass(_.sample(anims));
    window.setTimeout('animate()',5000);
}

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginFacebook() {
    if(!FB)return;
    $.LoadingOverlay("show");
    FB.getLoginStatus(function(response) {
        if(response.authResponse){
            FB.api('/me', function(info) {
                $.post("/api/login", info, function(player, status){
                    if (player){
                        location.href='/main?token='+player.token;                        
                    }else{
                        $.LoadingOverlay("hide");
                    }
                });
            });
        }else{
            $.LoadingOverlay("hide");
            FB.login();
        }
    }); 
}

function forceLogin() {
    $.LoadingOverlay("show");
    var player_id = $('#player_id').val();
    $.post("/api/login", {
        id: player_id,
        name: "xxxx"
    }, function(player, status){
        if (player){
            location.href='/main?token='+player.token;                        
        }else{
            $.LoadingOverlay("hide");
        }
    });
}

$(document).ready(function() { 
    
    $('.modal-trigger').click(function(){ 
        var url = $('.modal-trigger').attr("data-source");
        $.get( url, function( data ) {
            $( ".modal-content" ).html(data);
        });
    });
    $('.modal').modal();
});