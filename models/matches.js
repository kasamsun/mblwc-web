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
  }, {
    collection: 'matches'  
});

module.exports = mongoose.model('Match', MatchSchema);