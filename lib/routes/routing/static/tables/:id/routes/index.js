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
    head : ['To', 'Type', 'Via', 'Description'],
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
      jsonapi_response[i].to,
      jsonapi_response[i].type || '(not set)',
      jsonapi_response[i].via,
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
  // TODO: Add support for nexthop. Disabled until `prompt` adds support for it or I implement a custom procedure.
  apischema_properties.nexthop = null;
  delete apischema_properties.nexthop;

  var Netmask = require('netmask').Netmask;

  var custom_schema = {
    to        : {
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
    type      : {
      message: 'Possible values are: unicast, unreachable, blackhole, prohibit, local, broadcast, throw, nat, anycast or multicast.'
    },
    preference: {
      message: 'It has to be greater than 0 and less than 4294967296'
    },
    via       : {
      message: 'It has to be a dotted quad for IP and a sequence of hexadecimal halfwords separated by colons for IPv6.',
      conform: function (value) {
        return require('net').isIP(value);
      }
    },
    src       : {
      message: 'It has to be a dotted quad for IP and a sequence of hexadecimal halfwords separated by colons for IPv6.',
      conform: function (value) {
        return require('net').isIP(value);
      }
    },
    mtu       : {
      message: 'It has to be a number optionally preceded by the `lock` modifier.',
      conform: function (value) {
        // TODO: Add conform function this property. Check API static related validator since I think is wrong.
        return true;
      }
    },
    scope     : {
      message: 'Possible values are: host, link, global, nowhere or site',
      conform: function (value) {
        return apischema_properties.scope.enum.indexOf(value) != -1;
      }
    }
  };

  return require('lodash').merge(apischema_properties, custom_schema);
};