var Table = require('cli-table');
var colors = require('colors');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
  data: {
    link_only  : true,
    description: 'Show the settings available for the routing system.'
  },

  rules : {
    data: {
      description: 'rules related description.',
      formatter  : function (jsonapi_data) {
        var headings = [];

        if (!jsonapi_data.length) {
          return '(None)';
        }

        for (var prop in jsonapi_data[0]) {
          if (jsonapi_data[0].hasOwnProperty(prop)
            && prop != 'id') {

            headings.push(prop.charAt(0).toUpperCase() + prop.slice(1));
          }
        }

        var table = new Table({
          head : headings,
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
             i++) {

          var row = [];
          for (var prop in jsonapi_data[i]) {
            if (jsonapi_data[i].hasOwnProperty(prop)
              && prop != 'id') {

              row.push(jsonapi_data[i][prop]);
            }
          }

          table.push(row);
        }

        return table.toString();
      }

    },

    ':priority': {
      data: {
        description: 'rule description',
        formatter  : function (jsonapi_data) {
          var table = new Table(cliTableVerticalOptions);

          for (var prop in jsonapi_data) {
            if (jsonapi_data.hasOwnProperty(prop)
              && prop != 'id') {

              var heading = prop.charAt(0).toUpperCase() + prop.slice(1);
              var row = {};
              row[heading] = jsonapi_data[prop];

              table.push(row);
            }
          }

          return table.toString();
        }
      }
    }
  },
  tables: {
    data: {
      description: 'tables related description.',
      formatter  : function (jsonapi_data) {
        var table = new Table({
          head : [ 'Id', 'Name', 'Description'],
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
            jsonapi_data[i].id,
            jsonapi_data[i].name,
            jsonapi_data[i].description
          ]);
        }

        return table.toString();
      }
    },

    ':id': {
      data: {
        description: 'A table description',
        formatter  : function (jsonapi_data) {
          var table = new Table(cliTableVerticalOptions);

          table.push({
            'Path': jsonapi_data.id
          }, {
            'Value': jsonapi_data.name
          }, {
            'Description': jsonapi_data.description
          });

          return table.toString();
        }
      }
    }
  }
};