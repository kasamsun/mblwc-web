var mongoose =  require('mongoose');

var CommentSchema = new mongoose.Schema({
    id: {type: String, required: true},
    match_no: {type: Number, required: true},
    message: {type: String, required: true},
    submit_timestamp: {type: Date, required: true}
  }, {
    collection: 'comments'  
});

module.exports = mongoose.model('Comment', CommentSchema);