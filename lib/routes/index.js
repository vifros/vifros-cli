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

		info: {
			data: {
				link_only  : true,
				description: 'Show information about the system.'
			},

			time: {
				data: {
					description: 'Time related description.',
					formatter  : function (jsonapi_data) {
						var uptime = formatters.timespanInUTCtoHuman(jsonapi_data[0].value.up);
						var current = new Date(jsonapi_data[0].value.current).toString();

						var table = new Table(cliTableVerticalOptions);

						table.push({
							'Up Time': uptime
						}, {
							'Current Time': current
						});

						return table.toString();
					}
				}
			},

			os: {
				data: {
					description: 'OS related description.',
					formatter  : function (jsonapi_data) {
						var table = new Table(cliTableVerticalOptions);

						table.push({
							'Type': jsonapi_data[0].value.type
						}, {
							'Arch': jsonapi_data[0].value.arch
						}, {
							'Release': jsonapi_data[0].value.release
						});

						return table.toString();
					}
				}
			},

			memory: {
				data: {
					description: 'Memory related description.',
					formatter  : function (jsonapi_data) {
						var installed = formatters.toHumanFileSize(jsonapi_data[0].value.installed);
						var usage = jsonapi_data[0].value.usage;

						if (usage < 50) {
							usage = (usage + '%').green;
						}
						else if (usage >= 50 && usage < 80) {
							usage = (usage + '%').yellow;
						}
						else {
							usage = (usage + '%').red;
						}


						var table = new Table(cliTableVerticalOptions);

						table.push({
							'Installed': installed
						}, {
							'Usage': usage
						});

						return table.toString();
					}
				}
			},

			load: {
				data: {
					description: 'Load related description.',
					formatter  : function (jsonapi_data) {
						var load = jsonapi_data[0].value;

						for (var i = 0; i < 3; i++) {
							load[i] = load[i].toFixed(2);
						}

						var table = new Table(cliTableVerticalOptions);

						table.push({
							' 1min': load[0]
						}, {
							' 5min': load[1]
						}, {
							'15min': load[2]
						});

						return table.toString();
					}
				}
			},

			cpus: {
				data: {
					description: 'CPUs related description.',
					formatter  : function (jsonapi_data) {
						var cpus = jsonapi_data[0].value;

						var table = new Table({
							head : [ 'Usage', 'Model'],
							chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
								'bottom'  : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
								'left'    : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
								'right'   : '', 'right-mid': '',
								'middle'  : ' ' },
							style: {
								head           : ['yellow'],
								'padding-left' : 1,
								'padding-right': 1
							}
						});

						for (var core = 0, j = cpus.length;
						     core < j;
						     core++
							) {

							var usage = cpus[core].usage;
							if (usage < 50) {
								usage = (usage + '%').green;
							}
							else if (usage >= 50 && usage < 80) {
								usage = (usage + '%').yellow;
							}
							else {
								usage = (usage + '%').red;
							}

							table.push([
								usage, cpus[core].model
							]);
						}

						return table.toString();
					}
				}
			},

			swap: {
				data: {
					description: 'SWAP related description.',
					formatter  : function (jsonapi_data) {
						var installed = formatters.toHumanFileSize(jsonapi_data[0].value.installed);
						var usage = jsonapi_data[0].value.usage;

						if (usage < 50) {
							usage = (usage + '%').green;
						}
						else if (usage >= 50 && usage < 80) {
							usage = (usage + '%').yellow;
						}
						else {
							usage = (usage + '%').red;
						}


						var table = new Table(cliTableVerticalOptions);

						table.push({
							'Installed': installed
						}, {
							'Usage': usage
						});

						return table.toString();
					}
				}
			},

			disks: {
				data: {
					description: 'Disks related description.',
					formatter  : function (jsonapi_data) {
						var disks = jsonapi_data[0].value;

						var table = new Table({
							head : [ 'Path', 'Device', 'Usage', 'Installed'],
							chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
								'bottom'  : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
								'left'    : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
								'right'   : '', 'right-mid': '',
								'middle'  : ' ' },
							style: {
								head           : ['yellow'],
								'padding-left' : 1,
								'padding-right': 1
							}
						});

						for (var disk = 0, j = disks.length;
						     disk < j;
						     disk++
							) {

							var usage = disks[disk].usage;
							if (usage < 50) {
								usage = (usage + '%').green;
							}
							else if (usage >= 50 && usage < 80) {
								usage = (usage + '%').yellow;
							}
							else {
								usage = (usage + '%').red;
							}

							table.push([
								disks[disk].path, disks[disk].device, usage, formatters.toHumanFileSize(disks[disk].installed, true)
							]);
						}

						return table.toString();
					}
				}
			}
		},

		settings: {
			data: {
				description: 'Show the settings available for the system.'
			}
		},

		tunables: {
			data: {
				description: 'Show the tunables available in the system.'
			}
		},

		logging: {
			data: {
				link_only  : true,
				description: 'system logging description'
			},

			settings: {
				data: {
					description: 'Show the settings available for the logging system.'
				}
			}
		}
	}
};