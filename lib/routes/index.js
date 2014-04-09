var Table = require('cli-table');
var colors = require('colors');

var formatters = require('vifros-common').formatters;
var cliTableVerticalOptions = require('../common').cliTableVerticalOptions;

module.exports = {
	data: {
		link_only: true
	},

	system: {
		data: {
			link_only  : true,
			description: 'System related description.'
		},

		info: require('./system/info'),
		settings: require('./system/settings'),

		tunables: {
			data: {
				description: 'Show the tunables available in the system.'
			}
		},

		logging: {
			data: {
				link_only  : true,
				description: 'system logging description'
			}
		}
	}
};