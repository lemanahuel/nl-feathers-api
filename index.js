const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const mongoose = require('mongoose');
const cors = require('cors');

mongoose.Promise = global.Promise;

// Connect to your MongoDB instance(s)
mongoose.connect('mongodb://localhost:27017/todo-list');

// Create an Express compatible Feathers application instance.
const app = express(feathers());
app.use(cors());

// Turn on JSON parser for REST services
app.use(express.json());
// Turn on URL-encoded parser for REST services
app.use(express.urlencoded({ extended: true }));
// Enable REST services
app.configure(express.rest());
// app.use(express.notFound({ verbose: true }));
// app.use(express.errorHandler());
// Enable Socket.io services
app.configure(socketio());
// Connect to the db, create and register a Feathers service.

require('./modules/tasks/tasks.route')(app);

// Start the server.
const port = 5001;
app.listen(port, () => {
  console.log(`Feathers server listening on port ${port}`);
});