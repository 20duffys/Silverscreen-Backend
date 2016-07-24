app.listen(3000, function(){
  console.log('listen to events on "port".')
}

var express = require('express');
var cors = require('cors');
var fs = require('fs');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var path = require('path');
var request = require('request');
var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({extended: true}));

var MongoClient = mongodb.MongoClient;

var mongoUrl = 'mongodb://localhost:27017/OMDB&NYT';

app.get('/', function(request, response)){
  response.json({"description":"Silverscreen"});

});

app.get('/hitlist', function(request, response){
  MongoClient.connect(mongoUrl, function(err, db){
    var thehitlist = db.collection('hitlist');
    if (err) {
      console.log('Unable to connect to the mongoDB server. ERROR;', err);
    } else {
      hitlistCollection.find().toArray(function (err, result) {
        if (err) {
          console.log("ERROR!", err);
          response.json("error");
        } else if (result.length) {
          console.log('Found:', result);
          response.json(result);
        } else {
          console.log('no document(s) found with defined "find" criteria');
          response.json("none found");
        }
        db.close(function)() {
          console.log( "database CLOSED");
        });
      }); //end find

    }//end else
  }) //end mongoconnect
}); //end get all

app.post('/hitlist/new', function(request, response))
  console.log("request.body", request.body);

    MongoClient.connect(mongoUrl, function (err, db) {
      var thehitlist = db.collection('hitlist');
      if (err) {
        console.log("Unable to connect to the mongoDB server. Error:", err);
      } else {
        console.log('Connection established to', mongoUrl);
        console.log('Adding new user...');

        /*insert*/
      var newUser = request.body;
      favoritesCollection.insert([newUser], function (err, result) {
        if (err) {
          console.log(err);
          response.json("error");
        } else {
          console.log('Inserted.');
          console.log('RESULT!!!!', result);
          console.log("end result");
          response.json(result);
        }
        db.close(function(){
          console.log("database CLOSED");
        });
      }); //end insert
    } //end else
  }); //end mongo connect
}); //end add new client

/*find */

app.get('/hitlist/:name', function(request, response){
  console.log("request.params: ", request.params);
  MongoClient.connect(mongoUrl, function (err, db) {
    var thehitlist = db.collection('hitlist');
    if (err) {
      console.log('Unable to connect to the mongoDB server. Error:', err);
    } else {
      console.log('Finding by name... ');

      thehitlist.find(request.params).toArray(function (err, result) {
        if (err) {
          console.log("ERROR!", err);
          response.json("error");
        } else if (result.length) {
          console.log('Found:', result);
          response.json(result);
        } else {
          console.log('No film(s) found with defined "find" criteria');
          response.json("none found");
        }
        db.close(function() {
          console.log("database CLOSED");
        });
      }); //end find
    } //end else
  }); // end mongo connect

});

app.delete('/hitlist/:name', function(request, response) {

  console.log("request.body:", request.body);
  console.log("request.params:", request.params);

  MongoClient.connect(mongoUrl, function (err, db) {
    var thehitlist = db.collection('hitlist');
    if (err) {
      console.log('Unable to connect to the mongoDB server. ERROR:', err);
    } else {
      // We are connected!
      console.log('Deleting by name... ');

      thehitlist.remove(request.params, function(err, numOfRemovedDocs) {
        console.log("numOfRemovedDocs:", numOfRemovedDocs);
        if(err) {
          console.log("error!", err);
        } else { // after deletion, retrieve list of all
          thehitlist.find().toArray(function (err, result) {
            if (err) {
              console.log("ERROR!", err);
              response.json("error");
            } else if (result.length) {
              console.log('Found:', result);
              response.json(result);
            } else { //
              console.log('No document(s) found with defined "find" criteria');
              response.json("none found");
            }
            db.close(function() {
              console.log( "database CLOSED");
            });
          }); // end find
        } // end else
      }); // end remove
    } // end else
  }); // end mongo connect
}); // end delete

/* update */
app.put('/thehitlist/:name', function(request, response) {
  // response.json({"description":"update by name"});
  console.log("request.body", request.body);
  console.log("request.params:", request.params);

  var old = {name: request.body.name};
  var updateTo = {name: request.body.newName}

  MongoClient.connect(mongoUrl, function (err, db) {
    var favoritesCollection = db.collection('favorites');
    if (err) {
      console.log('Unable to connect to the mongoDB server. ERROR:', err);
    } else {
      // We are connected!
      console.log('Updating by name... ');

      /* Update */
      thehitlist.update(old,updateTo);

      setTimeout(function() {
        thehitlist.find(updateTo).toArray(function (err, result) {
          if (err) {
            console.log("ERROR!", err);
            response.json("error");
          } else if (result.length) {
            console.log('Found:', result);
            response.json(result);
          } else { //
            console.log('No document(s) found with defined "find" criteria');
            response.json("none found");
          }
          db.close(function() {
            console.log( "database CLOSED");
          }); // end db close
        }); // end find
      }, 1000);
    } // end else
  }); // end mongo connect
}); // end update
