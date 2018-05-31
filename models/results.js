var mongoose =  require('mongoose');

var ResultSchema = new mongoose.Schema({
    id: {type: String, required: true},
    match_no: {type: Number, required: true},
    home_score: {type: Number, required: true},
    away_score: {type: Number, required: true},
    right_score: {type: Number},
    right_result: {type: Number},
    wrong_result: {type: Number},
    score: {type: Number}
  }, {
    collection: 'results'  
});

module.exports = mongoose.model('Result', ResultSchema);