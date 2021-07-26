const mongoose = require('mongoose');
const {config} = require("../config/configData");

mongoose.connect(`mongodb+srv://${config.mongoUser}:${config.mongoPass}@cluster0.3fqza.mongodb.net/MStyle`, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("mongo connect");
  // we're connected!
})

module.exports = db;