var Table = require('cli-table');

// Monkey-patch String object with colors.
require('colors');

var formatters = require('../../../../utils').formatters;

/**
 * Custom formatter for a JSON+API response.
 *
 * @param {Object}    jsonapi_response
 */
exports.formatter = function formatter(jsonapi_response) {
  var table = new Table({
    chars: {
      'top'   : '', 'top-mid': '', 'top-left': '', 'top-right': '',
      'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
      'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
      'right' : '', 'right-mid': '',
      'middle': ' '
    },
    style: {
      head           : ['yellow'],
      'padding-left' : 1,
      'padding-right': 1
    }
  });

  switch (jsonapi_response.name) {
    case 'time':
      var uptime = formatters.timespanInUTCtoHuman(jsonapi_response.value.up);
      var current = new Date(jsonapi_response.value.current).toString();

      table.push({
        'Up Time': uptime
      }, {
        'Current Time': current
      });
      break;

    case 'os':
      table.push({
        'Type': jsonapi_response.value.type
      }, {
        'Arch': jsonapi_response.value.arch
      }, {
        'Release': jsonapi_response.value.release
      }, {
        'Platform': jsonapi_response.value.platform
      });
      break;

    case 'memory':
      var installed = formatters.toHumanFileSize(jsonapi_response.value.installed);
      var usage = jsonapi_response.value.usage;

      if (usage < 50) {
        usage = (usage + '%').green;
      }
      else if (usage >= 50 && usage < 80) {
        usage = (usage + '%').yellow;
      }
      else {
        usage = (usage + '%').red;
      }

      table.push({
        'Installed': installed
      }, {
        'Usage': usage
      });
      break;

    case 'load':
      var load = jsonapi_response.value;

      for (var i = 0; i < 3; i++) {
        load[i] = load[i].toFixed(2);
      }

      table.push({
        ' 1min': load[0]
      }, {
        ' 5min': load[1]
      }, {
        '15min': load[2]
      });
      break;

    case 'cpus':
      var cpus = jsonapi_response.value;

      // Override generic table with specific one.
      var table = new Table({
        head : ['Usage', 'Model'],
        chars: {
          'top'   : '', 'top-mid': '', 'top-left ': '', 'top-right': '',
          'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
          'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
          'right' : '', 'right-mid': '',
          'middle': ' '
        },
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
      break;

    case 'swap':
      var installed = formatters.toHumanFileSize(jsonapi_response.value.installed);
      var usage = jsonapi_response.value.usage;

      if (usage < 50) {
        usage = (usage + '%').green;
      }
      else if (usage >= 50 && usage < 80) {
        usage = (usage + '%').yellow;
      }
      else {
        usage = (usage + '%').red;
      }

      table.push({
        'Installed': installed
      }, {
        'Usage': usage
      });
      break;

    case 'disks':
      var disks = jsonapi_response.value;

      // Override generic table with specific one.
      var table = new Table({
        head : ['Path', 'Device', 'Usage', 'Installed'],
        chars: {
          'top'   : '', 'top-mid': '', 'top-left': '', 'top-right': '',
          'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
          'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
          'right' : '', 'right-mid': '',
          'middle': ' '
        },
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
      break;

    default:
      // Noop, already handled upstream.
      break;
  }

  return table.toString();
};