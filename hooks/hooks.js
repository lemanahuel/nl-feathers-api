const _ = require('lodash');
const errors = require('@feathersjs/errors');
const config = require('../config/config');

module.exports = {
  errorHandler: ctx => {
    if (ctx.error) {
      ctx.error.stack = null;
      // ctx.error = JSON.stringify(ctx.error);
      return ctx;
    }
  },
  isValidDomain: context => {
    if (_.includes(config.DOMAINS_WHITE_LIST, context.params.headers.origin || context.params.headers.host)) {
      return context;
    }
    throw new errors.NotAuthenticated('NotAuthenticated');
  },
  normalizeId: context => {
    context.id = context.id || context.params.route.id
  }
};