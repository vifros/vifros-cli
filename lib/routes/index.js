var _ = require('lodash');

var base = {
	data: {
		link_only: true
	},

	system: require('./system')
};

var tree_show = _.merge({}, base);
var tree_create = _.merge({}, base);

tree_show.data['description'] = 'Show information about resources and settings.';
tree_create.data['description'] = 'Create resources and settings.';

module.exports = {
	show  : tree_show,
	create: tree_create
};