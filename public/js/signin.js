
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
};

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
                        location.href='/main?id='+player.id+'&token='+player.token;
                    }else{
                        $.LoadingOverlay("hide");
                    }             
                });             
            });
        }else{
            $.LoadingOverlay("hide");
            FB.login();
            //location.href = encodeURI("https://www.facebook.com/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=/signin&response_type=token");
        }
    }); 
}

function logoutFacebook() {
    FB.logout(function(response) {
        // user is now logged out
        $('#message_info').innerHTML = 'logout complete';
    });
}

$(document).ready(function() {
});


// window.fbAsyncInit = function() {
//     FB.init({ appId: '582329818791668',
//               status: true, 
//               cookie: true,
//               xfbml: true,
//               oauth: true});
 
//     function authEvent(response) {
 
//         if (response.authResponse) {
//            //user is already logged in and connected
//             FB.api('/me', function(info) {
//                login(response, info);
//             });
//         } else {
//             //user is not connected to your app or logged out
//             $('#login_button').onclick = function() {
//                 FB.login(function(response) {
//                     if (response.authResponse) {
//                         FB.api('/me', function(info) {
//                             login(response, info);
//                         });   
//                     } else {
//                         //user cancelled login or did not grant authorization
//                     }
//                 }, {scope:'email,rsvp_event,status_update,publish_stream,user_about_me'});     
//             }
//         }
//     }
 
//     // run once with current status and whenever the status changes
//     FB.getLoginStatus(updateButton);
//     FB.Event.subscribe('auth.statusChange', updateButton);  
// };
// (function() {
//     var e = document.createElement('script'); e.async = true;
//     e.src = document.location.protocol 
//         + '//connect.facebook.net/en_US/all.js';
//     $('fb-root').appendChild(e);
// }());
 
 
// function login(response, info){
//     if (response.authResponse) {
//         accessToken =   response.authResponse.accessToken;
//         userid = info.id;
//         userInfo.innerHTML  = '<img src="https://graph.facebook.com/' + info.id + '/picture">' + info.name+"<br /> Your Access Token: " + accessToken;
//     }
// }

//$(document).ready(function() {
    // $('#login_button').onclick = function() {
    //     loginFacebook();
    // }
//});