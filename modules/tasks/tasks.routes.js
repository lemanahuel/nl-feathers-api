const multer = require('multer');
const multerMiddleware = multer({ storage: multer.memoryStorage() });
const TasksService = require('./tasks.service');

module.exports = app => {

  app.use('/tasks', TasksService);
  app.use('/tasks/:id/completed', {
    update: TasksService.completed
  });
  app.use('/tasks/:id/images', multerMiddleware.any(), (req, res, next) => {
    req.feathers.files = req.file || req.files;
    next();
  }, {
      update: TasksService.uploadImages
    });

};