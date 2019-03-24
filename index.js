const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');
const logger = require('feathers-logger');
const morgan = require('morgan');
const cors = require('cors');
const glob = require('glob');
const path = require('path');
const async = require('async');
const _ = require('lodash');
const fs = require('fs');
const mustache = require('mustache');
const listEndpoints = require('express-list-endpoints');
const config = require('./config/config');
const db = require('./integrations/mongodb');
const app = express(feathers());

db.connect();
app.set('views', __dirname + '/public');
app.set('view engine', 'html');
app.engine('html', (filePath, options, cb) => {
  fs.readFile(filePath, (err, content) => {
    if (err) return cb(err);
    return cb(null, mustache.to_html(content.toString(), options));
  });
});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.errorHandler());
// app.use(express.notFound({ verbose: true }));
app.use(express.static('./public'));
app.configure(express.rest());
app.configure(logger(morgan('tiny')));
app.configure(socketio());

app.use((req, res, next) => {
  req.feathers = req.feathers || {};
  req.feathers.headers = req.headers;
  next();
});

app.hooks({
  error: ctx => {
    console.error(`Error in '${ctx.path}' service method '${ctx.method}'`, ctx.error.stack);
  }
});

const loadRoutes = async () => {
  new Promise((resolve, reject) => {
    glob('./modules/**/*.routes.js', {}, (err, files) => {
      async.each(files, (file, cb) => {
        require(path.resolve(file))(app);
        cb(null);
      }, err => {
        if (!err) {
          return resolve(err);
        }
        return reject(err);
      });
    });
  });
};

const loadDocs = async () => {
  new Promise((resolve, reject) => {
    app.use('/docs', (req, res, next) => {
      let routes = _.map(listEndpoints(app), (value, key) => {
        return {
          path: value.path,
          methods: value.methods
        };
      });
      res.render('docs/docs', {
        app: {
          title: 'Probando render de feathers',
          description: 'Endpoints:'
        },
        endpoints: routes
      });
    });
    resolve(null);
  });
};

loadRoutes().then(loadDocs).then(() => {
  app.listen(config.PORT, () => {
    console.log(`Feathers server listening on port ${config.PORT}`);
  });
});
