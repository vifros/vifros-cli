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

  table.push({
    'Priority': jsonapi_response.priority
  }, {
    'Type': jsonapi_response.type || '(not set)'
  }, {
    'Table': jsonapi_response.table
  });

  if (jsonapi_response.from) {
    table.push({
      'From': jsonapi_response.from
    });
  }

  if (jsonapi_response.to) {
    table.push({
      'To': jsonapi_response.to
    });
  }

  if (jsonapi_response.iif) {
    table.push({
      'IIF': jsonapi_response.iif
    });
  }

  if (jsonapi_response.oif) {
    table.push({
      'OIF': jsonapi_response.oif
    });
  }

  if (jsonapi_response.tos || jsonapi_response.dsfield) {
    table.push({
      'TOS/DSFIELD': jsonapi_response.tos || jsonapi_response.dsfield
    });
  }

  if (jsonapi_response.fwmark) {
    table.push({
      'Fwmark': jsonapi_response.fwmark
    });
  }

  if (jsonapi_response.suppress_prefixlength) {
    table.push({
      'Suppress Prefix Length': jsonapi_response.suppress_prefixlength
    });
  }

  if (jsonapi_response.suppress_ifgroup) {
    table.push({
      'Suppress IF Group': jsonapi_response.suppress_ifgroup
    });
  }

  if (jsonapi_response.realms) {
    table.push({
      'Realms': jsonapi_response.realms
    });
  }

  if (jsonapi_response.nat) {
    table.push({
      'NAT': jsonapi_response.nat
    });
  }

  if (jsonapi_response.description) {
    table.push({
      'Description': jsonapi_response.description
    });
  }

  return table.toString();
};