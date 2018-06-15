var Player = require('../models/players');
var Match = require('../models/matches');
var Result = require('../models/results');
var Comment = require('../models/comments');
var moment = require('moment');

exports.addComment = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
    }
    if (!req.body.match_no) {
        throw new Error('match_no is required');
    }
    if (!req.body.message) {
        throw new Error('message is required');
    }
    
    comment = new Comment({
        id: req.payLoad.id,
        match_no: req.body.match_no,
        message: req.body.message,
        submit_timestamp: moment()
    });
    
    console.log("addComment [" + req.payLoad.id + ", " + req.body.match_no + "]");
    return comment.save();
};

exports.getComments = async function(req, res) {
    if (!req.payLoad.id) {
        throw new Error('payLoad.id is required');
    }
    if (!req.query.match_no) {
        throw new Error('match_no is required');
    }
    
    var comments = await Comment.find({
        match_no: req.query.match_no
    }).sort({submit_timestamp:-1}).exec();
    
    return {
        comments: comments
    };
};
