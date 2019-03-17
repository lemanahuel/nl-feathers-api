const Hooks = require('../../hooks/hooks');
const TasksService = require('./tasks.service');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

module.exports = app => {

  app.use('/tasks', TasksService).hooks({
    before: {
      create: Hooks.isValidDomain,
      update: Hooks.isValidDomain,
      patch: Hooks.isValidDomain,
      remove: Hooks.isValidDomain
    },
    error: {
      all: Hooks.errorHandler
    }
  });
  app.use('/tasks/:id/completed', {
    update: TasksService.completed
  }).hooks({
    before: {
      update: [Hooks.isValidDomain, Hooks.normalizeId]
    }
  });
  app.use('/tasks/:id/images', upload.any(), (req, res, next) => {
    req.feathers.files = req.file || req.files;
    next();
  }, {
      update: TasksService.uploadImages
    }).hooks({
      before: {
        update: [Hooks.isValidDomain, Hooks.normalizeId]
      }
    });

};