var me_info;

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
    window.setTimeout('animate()',8000);

    FB.getLoginStatus(function(response) {
        if(response.authResponse){
            FB.api('/me', function(info) {
                me_info = {
                    id: info.id,
                    name: info.name,
                    signed_request: response.authResponse.signedRequest
                };
                $('#welcome').html('Welcome, ' + me_info.name);
                $('#login_button').html('Continue to play');
                $("#login_button").toggleClass("disabled").addClass("animated");
            });
        }else{
            $("#login_button").toggleClass("disabled").addClass("animated");
        }
    }); 
};

var anims = ['swing','tada','jello','rubberBand','bounce'];
function animate() {
    $("#login_button").removeClass(anims.join(" ")).addClass(_.sample(anims));
    window.setTimeout('animate()',8000);
}

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function loginFacebook() {
    
    $.LoadingOverlay("show");
    if (me_info) {
        // fb login ready , go on 
        doLogin();
    } else {
        // fb login not ready , login facebook
        FB.login(function(response){
            if(response.authResponse){
                FB.api('/me', function(info) {
                    me_info = {
                        id: info.id,
                        name: info.name,
                        signed_request: response.authResponse.signedRequest
                    };
                    doLogin();
                });
            }else{
                $.LoadingOverlay("hide");
            }
        });
    }
}

function doLogin() {
    if (!me_info) return;

    var forcePlayerID = $('#force_player_id');
    if (forcePlayerID) {
        me_info.force_player_id = forcePlayerID.val();
    }else{
        me_info.force_player_id = undefined;
    }
    $.ajax({
        url: "/api/login",
        type: "post",
        data: me_info,
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
}

$(document).ready(function() { 
    
    $('.modal-trigger').click(function(){ 
        $(".modal-content").html('<div class="preloader-wrapper small active center-align" style="margin-top:120px"><div class="spinner-layer spinner-blue-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>');
        var url = $('.modal-trigger').attr("data-source");
        $.get( url, function( data ) {
            $(".modal-content" ).html(data);
        });
    });
    $('.modal').modal();
});