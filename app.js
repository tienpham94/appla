var express = require('express');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var path = require('path');

var Constants = require('./config/constants');
var app = express();

// require('./seed')
// Attempt to add seed data

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = process.env.MONGODB_URI ||"mongodb://localhost/appla";


// Mongoose.connect(process.env.MONGODB_URI ||"mongodb://localhost/appla");

var insertDocument = function(db, callback) {
//    db.collection('messages').insertOne( {
//     "room_slug" : "aab",
//     "message" : "Hi this is Tien Pham",
//     "owner_info" : {
//         "owner_id" : ObjectId("5a20703a6800d66b6fa264e5"),
//         "first_name" : "Tien",
//         "last_name" : "Pham"
//     },
//     "created_at" : 121242
// });
//
//
//   db.collection('messages').insertOne( {
//    "room_slug" : "aab",
//    "message" : "tyyni höpöhöpö Demon Katotaan jos se toimii oikein nyt tässä sitten tää on Googlen puhe puhe rajapinnan päälle rakennettu juttu et jos sulla on oma android-puhelin imuroida keskipiste sillä tavalla se tallentaa sun puhetta että tää laittaa mun puhetta liittyisin keskustelu analyysi homma ei toimi verrattain hyvin niinku näin koska suurinpiirtein",
//    "owner_info" : {
//        "owner_id" : ObjectId("5a20703a6800d66b6fa264e5"),
//        "first_name" : "Olli",
//        "last_name" : "Alm"
//    },
//    "created_at" : 121248
//   });
//
//   db.collection('messages').insertOne( {
//    "room_slug" : "aab",
//    "message" : "No niin kokeillaas Mä en tiedä toimiiko ja 10 Mä juttelin puheentunnistuksen Mitä ennen vanhaan ei ole ollenkaan mahdollista niin tää toimii äänellä kuin Äidillä oli sitten Tosiaan kun Johanna ja Väri vaihtelee puhelinta tässä ja se ihan sujuvasti jatkaa Eli se mallit ovat nykyään aika hienovaraisia ennen vanhan mallin tuli enemmän sellaisia treenattiin tietyille äänille ja sitten piti etukäteen kertoo että tämä puhua on tämän tyyppinen ihminen Mitähän se siellä puhuu väri vaihtelee puhelinta sujuvasti",
//    "owner_info" : {
//        "owner_id" : ObjectId("5a20703a6800d66b6fa264e3"),
//        "first_name" : "Tien",
//        "last_name" : "Pham"
//    },
//    "created_at" : 121241
//   });
  db.collection('messages').drop();
};

MongoClient.connect(url, function(err, db) {
  insertDocument(db, function() {
      db.close();
  });
});

//End Adding Seed data

var router = require('./router');
// var socket = require('./socket');
var ioServer 	= require('./socket')(app);

// var http = require('http').Server(app);
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!

app.use('/api/', router);

app.use('/libs', express.static(__dirname + '/public/libs'));
app.use('/bower_components', express.static(__dirname + '/public/bower_components'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/modules', express.static(__dirname + '/public/modules'));
app.use('/templates', express.static(__dirname + '/public/templates'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('index.html', { root: __dirname + '/public' });
});


// Handle 404 error.
// The last middleware.
app.use("*", function (req, res) {
    res.status(404).send('404');
});

// socket.connect(http);
//
// http.listen(3000, function () {
//     var host = http.address().address;
//     var port = http.address().port;
//     console.log("Server listening at http://%s:%s", host, port);
// });

ioServer.listen(port);

// module.exports = app;
