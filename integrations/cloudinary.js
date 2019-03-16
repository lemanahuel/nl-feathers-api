
const config = require('../config/config');
const Cloudinary = require('cloudinary');
const async = require('async');
const _ = require('lodash');

Cloudinary.config({
  url: config.CLOUDINARY_URL
});

module.exports = class Cloudy {

  static uploadImages(images) {
    return new Promise((resolve, reject) => {
      let uploaded = [];
      async.each(_.isArray(images) ? images : [images], (file, cb) => {
        if (file && file.buffer) {
          Cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`, res => {
            uploaded.push({
              url: res.url ? res.url.replace(/http:\/\//, 'https://') : res.url
            });
            cb(null);
          });
        } else {
          cb(null);
        }
      }, err => {
        if (!err) {
          return resolve(uploaded);
        }
        return reject(err);
      });
    });
  }

}