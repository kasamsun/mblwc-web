var mongoose =  require('mongoose');

var MatchSchema = new mongoose.Schema({
    match_no: {type: Number, unique: true, required: true},
    match_type: {type: String, required: true},
    match_day: {type: Number, required: true},
    start_timestamp: {type: Date, required: true},
    home_team: {type: String, required: true},
    away_team: {type: String, required: true},
    home_team_name: {type: String, required: true},
    away_team_name: {type: String, required: true},
    home_score: {type: Number},
    away_score: {type: Number},
    home_score_120: {type: Number},
    away_score_120: {type: Number},
    home_score_pk: {type: Number},
    away_score_pk: {type: Number},

    sum_home_win: {type: Number},
    sum_draw: {type: Number},
    sum_away_win: {type: Number},

    sum_score: {type: Number},
    sum_right_score: {type: Number},       
    sum_right_result: {type: Number},    
    sum_wrong_result: {type: Number}
  }, {
    collection: 'matches'  
});

module.exports = mongoose.model('Match', MatchSchema);