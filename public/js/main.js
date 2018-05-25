
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