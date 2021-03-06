
const config = require('../config/config');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(config.SENDGRID_API_KEY);

module.exports = class Sendgrid {

  static send(params) {
    return new Promise((resolve, reject) => {
      return sgMail.send({
        from: 'NL-FEATHERS-API <lema.nahuel+feathers-api@gmail.com>',
        to: 'lema.nahuel@gmail.com',
        subject: `Notificacion de ${params.action} desde NL-FEATHERS-API`,
        html: `Se realizo la accion <strong>${params.action}</strong> en la tarea ${params.oldTask.title} ahora es <strong>${params.newTask.title}!</strong>`,
      }).then(resolve).catch(reject);
    });
  }

}