var lodash = require('lodash');

var base = {
  data: {
    link_only: true
  },
  
  system : require('./system'),
  routing: require('./routing')
};

var tree_show = lodash.merge({}, base);

tree_show.data['description'] = 'Show information about resources and settings.';

module.exports = {
  show: tree_show
};