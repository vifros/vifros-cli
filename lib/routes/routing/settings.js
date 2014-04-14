var Table = require('cli-table');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
	data: {
		link_only  : true,
		description: 'Show the settings available for the routing system.'
	},

	ip_forward_v4: {
		data: {
			description: 'ip_forward_v4 related description.',
			formatter  : function (jsonapi_data) {
				var table = new Table(cliTableVerticalOptions);
				var status = 'IPv4 Forwarding is: ';

				if (jsonapi_data[0].value) {
					status += 'enabled'.green;
				}
				else {
					status += 'disabled'.red;
				}

				table.push([
					status
				]);

				return table.toString();
			}
		}
	},

	ip_forward_v6: {
		data: {
			description: 'ip_forward_v6 related description.',
			formatter  : function (jsonapi_data) {
				var table = new Table(cliTableVerticalOptions);
				var status = 'IPv6 Forwarding is: ';

				if (jsonapi_data[0].value) {
					status += 'enabled'.green;
				}
				else {
					status += 'disabled'.red;
				}

				table.push([
					status
				]);

				return table.toString();
			}
		}
	}
};