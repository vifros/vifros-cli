var Table = require('cli-table');

var cliTableVerticalOptions = require('../../common').cliTableVerticalOptions;

module.exports = {
  data: {
    link_only  : true,
    description: 'Show the settings available for the system.'
  },

  hostname   : {
    data: {
      description: 'Hostname related description.',
      formatter  : function (jsonapi_data) {
        var table = new Table(cliTableVerticalOptions);

        table.push([
          jsonapi_data.value
        ]);

        return table.toString();
      }
    }
  },
  domain     : {
    data: {
      description: 'Domain related description.',
      formatter  : function (jsonapi_data) {
        var table = new Table(cliTableVerticalOptions);

        table.push([
          (jsonapi_data.value) ? jsonapi_data.value : '(None)'
        ]);

        return table.toString();
      }
    }
  },
  nameservers: {
    data: {
      description: 'Nameservers related description.',
      formatter  : function (jsonapi_data) {
        var table = new Table({
          head : [ 'Nameserver'],
          chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
            'bottom'    : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
            'left'      : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
            'right'     : '', 'right-mid': '',
            'middle'    : ' ' },
          style: {
            head           : ['yellow'],
            'padding-left' : 1,
            'padding-right': 1
          }
        });

        if (jsonapi_data.value.length) {
          for (var i = 0, j = jsonapi_data.value.length;
               i < j;
               i++
            ) {

            table.push([
              jsonapi_data.value[i]
            ]);
          }
        }
        else {
          table.push([
            '(None)'
          ]);
        }

        return table.toString();
      }
    }
  }
};