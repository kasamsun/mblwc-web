var express = require('express')  
var app = express()
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = require('./routes');

var db_url = "mongodb://127.0.0.1:27017/mblwc";
if (process.env.APP_ENV==='PRD'){
    //db_url = "mongodb://mblwc:mblwc@ds133550.mlab.com:33550/mblwc";
    db_url = "mongodb://uezo1pgaabt2y1o:Aj3Ms6vC16UL7OKJjN56@bnjo0mjdq69bryf-mongodb.services.clever-cloud.com:27017/bnjo0mjdq69bryf";
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
app.use(function(err, req, res, next) {
    if (req.path.indexOf("/api/")>=0) {
        res.status(err.status || 500);
        res.send({
            error: {
                message: err.message
            }
        });
    } else {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});
app.use('/', router);
app.listen(8080, function () {
    console.log('App listening on port 8080')
})

exports = module.exports = app;
exports = module.exports = mongoose;