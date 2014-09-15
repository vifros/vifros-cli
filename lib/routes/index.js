var lodash = require('lodash');

var base = {
  data: {
    link_only: true
  },

  interfaces: require('./interfaces'),
  system    : require('./system'),
  routing   : require('./routing')
};

var tree_show = lodash.merge({}, base);
tree_show.data['description'] = 'Show information about resources and settings.';

var tree_create = lodash.merge({}, base);
tree_create.data['description'] = 'Create new resources.';

module.exports = {
  show  : tree_show,
  create: tree_create
};