

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

var mongoUrl = 'mongodb://localhost:27017/OM'
