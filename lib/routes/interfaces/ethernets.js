var Table = require('cli-table');
var colors = require('colors');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
  data: {
    description: 'show ethernets.',
    formatter  : function (jsonapi_data) {
      var table = new Table({
        head : [ 'Status', 'Name', 'MAC', 'MTU', 'Description'],
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

        var operational_status_color = 'green';
        switch (jsonapi_data[i].status.operational) {
          case 'DOWN':
            operational_status_color = 'red';
            break;
          case 'NOTPRESENT':
            operational_status_color = 'magenta';
        }

        table.push([
          jsonapi_data[i].status.operational[operational_status_color],
          jsonapi_data[i].name,
          jsonapi_data[i].mac,
          jsonapi_data[i].mtu,
          jsonapi_data[i].description || ''
        ]);
      }

      return table.toString();
    }
  },

  ':name': {
    data: {
      description: 'An ethernet description',
      formatter  : function (jsonapi_data) {
        var table = new Table(cliTableVerticalOptions);

        var operational_status_color = 'green';
        switch (jsonapi_data.status.operational) {
          case 'DOWN':
            operational_status_color = 'red';
            break;
          case 'NOTPRESENT':
            operational_status_color = 'magenta';
        }

        table.push({
          'Status': jsonapi_data.status.operational[operational_status_color]
        }, {
          'Name': jsonapi_data.name
        }, {
          'MAC': jsonapi_data.mac
        }, {
          'MTU': jsonapi_data.mtu
        }, {
          'Description': jsonapi_data.description || ''
        });

        return table.toString();
      }
    },

    addresses: {
      data: {
        description: 'addresses related description.',
        formatter  : function (jsonapi_data) {
          var headings = [];

          if (!jsonapi_data.length) {
            return '(None)';
          }

          for (var prop in jsonapi_data[0]) {
            if (jsonapi_data[0].hasOwnProperty(prop)) {
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
              if (jsonapi_data[i].hasOwnProperty(prop)) {
                row.push(jsonapi_data[i][prop]);
              }
            }

            table.push(row);
          }

          return table.toString();
        }
      },

      ':id': {
        data: {
          description: 'An address description',
          formatter  : function (jsonapi_data) {
            var table = new Table(cliTableVerticalOptions);

            for (var prop in jsonapi_data) {
              if (jsonapi_data.hasOwnProperty(prop)) {

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
    }
  }
};