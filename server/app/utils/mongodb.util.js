const mongoose = require('mongoose');
const config = require('../config');

async function connect() {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.db.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database!');
  } catch (error) {
    console.log('Cannot connect to the database!', error);
  }
}

module.exports = { connect };
