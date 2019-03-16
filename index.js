const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const logger = require('feathers-logger');
const morgan = require('morgan');
const cors = require('cors');
const config = require('./config/config');
const db = require('./integrations/mongodb');
const app = express(feathers());

db.connect();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.configure(express.rest());
// app.use(express.notFound({ verbose: true }));
// app.use(express.errorHandler());
app.configure(logger(morgan('tiny')));
app.configure(socketio());
app.hooks({
  error: async context => {
    console.error(`Error in '${context.path}' service method '${context.method}'`, context.error.stack);
  }
});

require('./modules/tasks/tasks.routes')(app);

app.listen(config.PORT, () => {
  console.log(`Feathers server listening on port ${config.PORT}`);
});