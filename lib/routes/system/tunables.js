var Table = require('cli-table');
var colors = require('colors');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
  data: {
    description: 'Show the tunables available in the system.',
    schema     : [
      {
        name    : 'path',
        type    : 'string',
        required: true
      },
      {
        name    : 'value',
        type    : 'string',
        required: true
      },
      {
        name: 'description',
        type: 'string'
      }
    ],
    formatter  : function (jsonapi_data) {
      var table = new Table({
        head : [ 'Path', 'Value', 'Description'],
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

      for (var i = 0, j = jsonapi_data.length;
           i < j;
           i++
        ) {

        table.push([
          jsonapi_data[i].path,
          jsonapi_data[i].value.blue,
          jsonapi_data[i].description.grey
        ]);
      }

      return table.toString();
    }
  },

  ':path': {
    data: {
      description: 'Tunables path description',
      formatter  : function (jsonapi_data) {
        var table = new Table(cliTableVerticalOptions);

        table.push({
          'Path': jsonapi_data.path
        }, {
          'Value': jsonapi_data.value.blue
        }, {
          'Description': jsonapi_data.description.grey
        });

        return table.toString();
      }
    }
  }
};