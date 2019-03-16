const _ = require('lodash');
const Cloudy = require('../../integrations/cloudinary');
const Sendgrid = require('../../integrations/sendgrid');
const TasksModel = require('./tasks.model');

module.exports = {

  setup(app) {
    this.app = app;
  },

  async find(params) {
    let q = params && params.query;
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

    return await Sendgrid.send({
      oldTask,
      newTask,
      action: 'tarea actualizada'
    }).then(res => {
      return newTask;
    });
  },

  async remove(id, params) {
    // return TasksModel.findByIdAndRemove(id).lean().exec();
    return TasksModel.findByIdAndUpdate(id, {
      enable: false
    }).lean().exec();
  },

  async uploadImages(id, data, params) {
    let images = await Cloudy.uploadImages(params.files);
    let oldTask = await TasksModel.findById(params.route.id).select('images').lean().exec();

    return TasksModel.findByIdAndUpdate(params.route.id, {
      images: _.concat(oldTask.images || [], _.map(images, img => img.url))
    }).lean().exec();
  },

  async completed(id, data, params) {
    return TasksModel.findByIdAndUpdate(params.route.id, {
      completed: data.completed
    }, { new: true, safe: true }).lean().exec();
  }
};