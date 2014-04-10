var Table = require('cli-table');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
	data: {
		description: 'Show the tunables available in the system.',
		formatter  : function (jsonapi_data) {
			var table = new Table({
				head : [ 'Path', 'Value', 'Description'],
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
					jsonapi_data[i].path,
					jsonapi_data[i].value,
					jsonapi_data[i].description
				]);
			}

			return table.toString();
		}
	},

	':path': {
		data: {
			description: 'Tunables path logging description',
			formatter  : function (jsonapi_data) {
				var table = new Table(cliTableVerticalOptions);

				table.push({
					'Path': jsonapi_data[0].path
				}, {
					'Value': jsonapi_data[0].value
				}, {
					'Description': jsonapi_data[0].description
				});

				return table.toString();
			}
		}
	}
};