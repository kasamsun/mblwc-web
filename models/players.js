var mongoose =  require('mongoose');

var PlayerSchema = new mongoose.Schema({
    id: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    token: {type: String, required: true},
    score: {type: Number, required: true},
    play: {type: Number, required: true},
    right_score: {type: Number, required: true},
    right_result: {type: Number, required: true},
    wrong_result: {type: Number, required: true}
  }, {
    collection: 'players'  
});

module.exports = mongoose.model('Player', PlayerSchema);