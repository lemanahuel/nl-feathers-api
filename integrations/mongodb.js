const config = require('../config/config');
const mongoose = require('mongoose');

module.exports = class DB {

  static connect() {
    mongoose.Promise = global.Promise;
    return mongoose.connect(config.MONGODB_URI, {
      promiseLibrary: global.Promise,
      useNewUrlParser: true
    });
  }

}