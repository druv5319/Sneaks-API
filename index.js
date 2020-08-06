//const express = require('express');
//const app = express();
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
//require('./routes/sneaks.routes.js')(app);
const SneaksAPI = require('./controllers/sneaks.controllers.js');

mongoose.Promise = global.Promise;
/*Sneaker.deleteMany({ }, function (err) {
  if(err) console.log(err);
  console.log("Successful deletion");
});*/

// Connecting to the database
mongoose.connect(dbConfig.url, {}).then(() => {
  console.log("Successfully connected to the database");
}).catch(err => {
  console.log('Could not connect to the database', err);
  process.exit();
});

//app.listen('8080');
//console.log('API is running on http://localhost:8080');
//module.exports = app;
module.exports = SneaksAPI;
