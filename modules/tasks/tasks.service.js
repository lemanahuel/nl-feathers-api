
const service = require('feathers-mongoose');
const TasksModel = require('./tasks.model');

module.exports = {
  setup(app) {
    this.app = app;
  },
  async find(params) {
    let q = params;
    let findParams = { enable: true };
    let queryParams = {};

    if (q.sort) {
      queryParams.sort = q.sort;
    }
    if (q.filter) {
      findParams[_.replace(q.filter, '-', '')] = _.indexOf(q.filter, '-') > -1 ? false : true;
    }
    return TasksModel.find(findParams, null, queryParams).lean().exec();
  },
  async get(id, params) {
    return TasksModel.findById(id).lean().exec();
  },
  async create(data, params) {
    return TasksModel.create(data);
  },
  async update(id, data, params) {
    let oldTask = await TasksModel.findById(id).lean().exec();
    let newTask = await TasksModel.findByIdAndUpdate(id, data, { new: true, safe: true }).lean().exec();
    // Sendgrid.send({
    //   oldTask,
    //   newTask,
    //   action: 'tarea actualizada'
    // }).then(() => {
    //   res.send(newTask);
    //   next();
    // }, next);
    return newTask;
  },
  // async patch(id, data, params) {
  //   return TasksModel.find().exec().then();
  // },
  async remove(id, params) {
    // return TasksModel.findByIdAndRemove(id).lean().exec();
    return TasksModel.findByIdAndUpdate(id, {
      enable: false
    }).lean().exec();
  },
  async updateImages(params) {
    let images = await Cloudy.uploadImages(req.files);
    let oldTask = await TasksModel.findById(id).select('images').lean().exec();

    return TasksModel.findByIdAndUpdate(params.route.id, {
      images: _.concat(oldTask.images || [], _.map(images, img => img.url))
    }).lean().exec();
  },
  async completed(id, data) {
    return TasksModel.findByIdAndUpdate(data.taskId, {
      completed: data.completed
    }, { new: true, safe: true }).lean().exec();
  }
};