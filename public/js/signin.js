
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
            //$('#debug').html(JSON.stringify(response.authResponse,null,2));
            $.LoadingOverlay("hide");
            doLogin(response.authResponse);
        }else{
            FB.login(function(response){
                doLogin();
            });
            
        }
    }); 
}

function doLogin(authResponse) {
    FB.api('/me', function(info) {
        info.signed_request = authResponse.signedRequest;
        var forcePlayerID = $('#force_player_id');
        if (forcePlayerID) {
            info.force_player_id = forcePlayerID.val();
        }
        //$('#debug').html(JSON.stringify(info,null,2));
        $.ajax({
            url: "/api/login",
            type: "post",
            data: info,
            dataType: "json",
            success: function(player) {
                location.href='/main?token='+player.token; 
            },
            error: function(data){
                err = JSON.parse(data.responseText);
                M.toast({html: err.error.message, classes: 'rounded'});
                $.LoadingOverlay("hide");
            }
        });
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