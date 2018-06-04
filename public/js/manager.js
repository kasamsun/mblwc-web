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
        dataType: 'json',
        data: {
            match_no: $('#cal_by_match').val()
        },
        headers: {
            "x-access-token": getParameterByName('token')
        },
        success: function(result) {                
            $.LoadingOverlay("hide");
            M.toast({html: result.no_of_player + " Players calculated", classes: 'rounded'});
        },
        error: function(data){
            $.LoadingOverlay("hide");
            err = JSON.parse(data.responseText);
            M.toast({html: err.error.message, classes: 'rounded'});
        }
    });

}

function calcAll() {         
    $.LoadingOverlay("show");
    $.ajax({
        url: "/api/calc-all",
        type: 'post',
        data: {},
        dataType: 'json',
        headers: {
            "x-access-token": getParameterByName('token')
        },
        success: function(result) {                
            $.LoadingOverlay("hide");
            M.toast({html: result.no_of_player + " Players, " + result.no_of_match + " Matches calculated", classes: 'rounded'});
        },
        error: function(data){
            $.LoadingOverlay("hide");
            err = JSON.parse(data.responseText);
            M.toast({html: err.error.message , classes: 'rounded'});
        }
    });
}

function sumScore() {         
    $.LoadingOverlay("show");
    $.ajax({
        url: "/api/sum-score",
        type: 'post',
        data: {},
        dataType: 'json',
        headers: {
            "x-access-token": getParameterByName('token')
        },
        success: function(result) {      
            $.LoadingOverlay("hide");
            M.toast({html: result.no_of_player + " Players, " + result.no_of_match + " Matches summarized", classes: 'rounded'});
        },
        error: function(data){
            $.LoadingOverlay("hide");
            err = JSON.parse(data.responseText);
            M.toast({html: err.error.message , classes: 'rounded'});
        }
    });
}