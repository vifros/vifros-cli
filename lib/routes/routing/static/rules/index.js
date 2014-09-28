var Table = require('cli-table');

// Monkey-patch String object with colors.
require('colors');

/**
 * Custom formatter for a JSON+API response.
 *
 * @param {Object}    jsonapi_response
 */
exports.formatter = function formatter(jsonapi_response) {
  var table = new Table({
    head : ['Priority', 'Type', 'Table', 'From', 'To', 'Description'],
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

  for (var i = 0, j = jsonapi_response.length;
       i < j;
       i++
  ) {

    table.push([
      jsonapi_response[i].priority,
      jsonapi_response[i].type || '(not set)',
      jsonapi_response[i].table,
      jsonapi_response[i].from || '',
      jsonapi_response[i].to || '',
      jsonapi_response[i].description || ''
    ]);
  }

  return table.toString();
};

/**
 * Returns a compiled version of a schema, taking into account the apischema properties and
 * the required attributes needed for the prompt.
 *
 * @param   {Object}    apischema_properties
 * @return  {Object}
 */
exports.compileSchema = function compileSchema(apischema_properties) {
  var Netmask = require('netmask').Netmask;

  var custom_schema = {
    type    : {
      message: 'Possible values are: unicast, blackhole, unreachable, prohibit or nat'
    },
    priority: {
      message: 'It has to be greater than 0 and less than 32767'
    },
    table   : {
      message: 'It has to be greater than 0 and less than 2147483648'
    },
    from    : {
      message: 'It has to be a dotted quad for IPv4 and a sequence of hexadecimal halfwords separated by colons for IPv6. The address may be followed by a slash and a decimal number which encodes the network prefix length.',
      conform: function (value) {
        try {
          var netmask_from = new Netmask(value);
        }
        catch (e) {
          return false;
        }
        return true;
      }
    },
    to      : {
      message: 'It has to be a dotted quad for IPv4 and a sequence of hexadecimal halfwords separated by colons for IPv6. The address may be followed by a slash and a decimal number which encodes the network prefix length.',
      conform: function (value) {
        try {
          var netmask_to = new Netmask(value);
        }
        catch (e) {
          return false;
        }
        return true;
      }
    },
    nat     : {
      message: 'It has to be a dotted quad for IPv4 and a sequence of hexadecimal halfwords separated by colons for IPv6. The address may be followed by a slash and a decimal number which encodes the network prefix length.',
      conform: function (value) {
        try {
          var netmask_nat = new Netmask(value);
        }
        catch (e) {
          return false;
        }
        return true;
      }
    }
  };

  return require('lodash').merge(apischema_properties, custom_schema);
};