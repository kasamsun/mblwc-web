//$.LoadingOverlay("show");
$(document).ready(function() {
    
});

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function calcMatch() {
    if (!$('#cal_by_match').val()){
        M.toast({html: "Please enter match no", classes: 'rounded'});
        return;
    }   
    $.LoadingOverlay("show");
    $.ajax({
        url: "/api/calc-match",
        type: 'post',
        data: {
            match_no: $('#cal_by_match').val()
        },
        headers: {
            "x-access-token": getParameterByName('token')
        },
        dataType: 'json',
        success: function(result) {                
            $.LoadingOverlay("hide");
            M.toast({html: result.message, classes: 'rounded'});
        }
    });

}

function calcPlayer() {  
    if (!$('#cal_by_player').val()){
        M.toast({html: "Please enter player id", classes: 'rounded'});
        return;
    }          
    $.LoadingOverlay("show");
    $.ajax({
        url: "/api/calc-player",
        type: 'post',
        data: {
            player_id: $('#cal_by_player').val()
        },
        headers: {
            "x-access-token": getParameterByName('token')
        },
        dataType: 'json',
        success: function(result) {                
            $.LoadingOverlay("hide");
            M.toast({html: result.message, classes: 'rounded'});
        }
    });
    
}

function calcAll() {         
    $.LoadingOverlay("show");
    $.ajax({
        url: "/api/calc-all",
        type: 'post',
        data: {},
        headers: {
            "x-access-token": getParameterByName('token')
        },
        dataType: 'json',
        success: function(result) {                
            $.LoadingOverlay("hide");
            M.toast({html: result.message, classes: 'rounded'});
        }
    });
}

function sumScore() {         
    $.LoadingOverlay("show");
    $.ajax({
        url: "/api/sum-score",
        type: 'post',
        data: {},
        headers: {
            "x-access-token": getParameterByName('token')
        },
        dataType: 'json',
        success: function(result) {                
            $.LoadingOverlay("hide");
            M.toast({html: result.message, classes: 'rounded'});
        }
    });
}