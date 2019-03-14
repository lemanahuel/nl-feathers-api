const TasksService = require('./tasks.service');
module.exports = app => {

  app.use('/tasks', TasksService);
  app.use('/tasks/:id/completed', {
    update: TasksService.completed
  });

};