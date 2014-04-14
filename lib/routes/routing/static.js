var Table = require('cli-table');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
	data: {
		link_only  : true,
		description: 'Show the settings available for the routing system.'
	},

	rules: {
		data: {
			description: 'ip_forward_v4 related description.',
			formatter  : function (jsonapi_data) {
				var table = new Table({
					head : [ 'Type', 'Priority', 'Table', 'Description'],
					chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
						'bottom'  : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
						'left'    : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
						'right'   : '', 'right-mid': '',
						'middle'  : ' '
					},
					style: {
						head           : ['yellow'],
						'padding-left' : 1,
						'padding-right': 1
					}
				});

				for (var i = 0, j = jsonapi_data.length;
				     i < j;
				     i++
					) {

					table.push([
						jsonapi_data[i].type,
						jsonapi_data[i].priority,
						jsonapi_data[i].table,
						jsonapi_data[i].description
					]);
				}

				return table.toString();
			}

		}
	},

	tables: {
		data: {
			description: 'ip_forward_v6 related description.',
			formatter  : function (jsonapi_data) {
				var table = new Table({
					head : [ 'Id', 'Name', 'Description'],
					chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
						'bottom'  : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
						'left'    : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
						'right'   : '', 'right-mid': '',
						'middle'  : ' '
					},
					style: {
						head           : ['yellow'],
						'padding-left' : 1,
						'padding-right': 1
					}
				});

				for (var i = 0, j = jsonapi_data.length;
				     i < j;
				     i++
					) {

					table.push([
						jsonapi_data[i].id,
						jsonapi_data[i].name,
						jsonapi_data[i].description
					]);
				}

				return table.toString();
			}
		}
	}
};