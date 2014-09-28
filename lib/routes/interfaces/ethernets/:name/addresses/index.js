/**
 * Custom formatter for a JSON+API response.
 *
 * @param {Object}    jsonapi_response
 */
exports.formatter = function formatter(jsonapi_response) {
  var Table = require('cli-table');

  // Monkey-patch String object with colors.
  require('colors');

  var table = new Table({
    head : ['Scope', 'Address', 'Broadcast', 'Peer', 'Description'],
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
       i++) {

    table.push([
      jsonapi_response[i].scope || '(not set)',
      jsonapi_response[i].address,
      jsonapi_response[i].broadcast || '',
      jsonapi_response[i].peer || '',
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
    address  : {
      message: 'It has to be a dotted quad for IPv4 and a sequence of hexadecimal halfwords separated by colons for IPv6. The address may be followed by a slash and a decimal number which encodes the network prefix length.',
      conform: function (value) {
        try {
          var netmask_address = new Netmask(value);
        }
        catch (e) {
          return false;
        }
        return true;
      }
    },
    peer     : {
      message: 'It must be a dotted quad for IPv4 and a sequence of hexadecimal halfwords separated by colons for IPv6. The address may be followed by a slash and a decimal number which encodes the network prefix length.',
      conform: function (value) {
        try {
          var netmask_peer = new Netmask(value);
        }
        catch (e) {
          return false;
        }
        return true;
      }
    },
    broadcast: {
      message: 'It can be one of the special symbols + and - instead of the broadcast address or a dotted quad for IPv4 and a sequence of hexadecimal halfwords separated by colons for IPv6. The address may be followed by a slash and a decimal number which encodes the network prefix length.',
      conform: function (value) {
        if (value == '+'
          || value == '-') {

          return true;
        }

        try {
          var netmask_broadcast = new Netmask(value);
        }
        catch (e) {
          return false;
        }
        return true;
      }
    },
    scope    : {
      message: 'Possible values are: host, link, global, nowhere or site',
      conform: function (value) {
        return apischema_properties.scope.enum.indexOf(value) != -1;
      }
    }
  };

  return require('lodash').merge(apischema_properties, custom_schema);
};