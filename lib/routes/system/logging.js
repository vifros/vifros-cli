var Table = require('cli-table');
var colors = require('colors');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
  data: {
    link_only  : true,
    description: 'Show system logging description'
  },

  settings: {
    data: {
      link_only  : true,
      description: 'Show the logging settings.'
    },

    transport_console: {
      data: {
        description: 'transport_console related description.',
        formatter  : function (jsonapi_data) {
          var table = new Table(cliTableVerticalOptions);

          table.push({
            'Enabled': jsonapi_data.value.enabled.toString()[(jsonapi_data.value.enabled) ? 'green' : 'red']
          }, {
            'Colorize': jsonapi_data.value.colorize.toString()[(jsonapi_data.value.colorize) ? 'green' : 'red']
          }, {
            'Timestamp': jsonapi_data.value.timestamp.toString()[(jsonapi_data.value.timestamp) ? 'green' : 'red']
          });

          return table.toString();
        }
      }
    }
  },

  logs: {
    data: {
      description: 'Show the logs available in the system.',
      formatter  : function (jsonapi_data) {
        var table = new Table({
          head : [ 'Timestamp', 'Module', 'Level', 'Tags', 'Message'],
          chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
            'bottom'    : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
            'left'      : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
            'right'     : '', 'right-mid': '',
            'middle'    : ' '
          },
          style: {
            head           : ['yellow'],
            'padding-left' : 1,
            'padding-right': 1
          }
        });

        var level_color = '';

        for (var i = 0, j = jsonapi_data.length;
             i < j;
             i++
          ) {

          switch (jsonapi_data[i].level) {
            case 'info' :
              level_color = 'blue';
              break;
            case 'error' :
              level_color = 'red';
              break;
            default :
              level_color = 'yellow';
              break;
          }

          table.push([
            jsonapi_data[i].timestamp,
            jsonapi_data[i].module,
            jsonapi_data[i].level[level_color],
            jsonapi_data[i].tags.join(','),
            jsonapi_data[i].message
          ]);
        }

        return table.toString();
      }
    }
  }
};