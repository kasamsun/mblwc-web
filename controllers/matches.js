var Match = require('../models/matches');

exports.getMatches = async function(req, res) {
    if (!req.query.id) {
        throw new Error("id is required");
    }

    var matches = await Match.find({}).sort({match_no:1}).exec();
    return matches
};

