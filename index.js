const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('./routes/sneaks.routes.js')(app);
require('dotenv').config();
const SneaksAPI = require('./controllers/sneaks.controllers.js');

var port = process.env.PORT || 4000;
mongoose.Promise = global.Promise;
/*Sneaker.deleteMany({ }, function (err) {
  if(err) console.log(err);
  console.log("Successful deletion");
});*/

// Connecting to the database
//mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sneakers');

app.listen(port, function () {
  console.log(`Sneaks app listening on port `, port);
 });

module.exports = app;
module.exports = SneaksAPI;
