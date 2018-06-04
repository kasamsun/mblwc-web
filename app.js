var express = require('express')  
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = require('./routes');

var db_url = "mongodb://127.0.0.1:27017/mblwc";
if (process.env.APP_ENV==='PRD'){
    //db_url = "mongodb://mblwc:mblwc@ds133550.mlab.com:33550/mblwc";
    db_url = "mongodb://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@bnjo0mjdq69bryf-mongodb.services.clever-cloud.com:27017/bnjo0mjdq69bryf";
}
console.log(db_url);
mongoose.connect(db_url);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database Connection Status: ' + 
    mongoose.connection.readyState);
});

app.locals.moment = require('moment');
app.locals._ = require('underscore');
app.set('view engine', 'pug')
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', router);
app.use(function(err, req, res, next) {
    console.log(err);
    if (req.path.indexOf("/api/")>=0) {
        res.status(400).json({
            error: {
                message: err.message
            }
        })
    } else {
        res.status(400).render('error', {
            message: err.message,
            error: {}
        });
    }
});
app.listen(8080, function () {
    console.log('App listening on port 8080')
})

exports = module.exports = app;
exports = module.exports = mongoose;