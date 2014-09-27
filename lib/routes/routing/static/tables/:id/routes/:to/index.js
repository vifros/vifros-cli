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
    'To': jsonapi_response.to
  }, {
    'Type': jsonapi_response.type || '(not set)'
  }, {
    'Via': jsonapi_response.via
  });

  if (jsonapi_response.tos || jsonapi_response.dsfield) {
    table.push({
      'TOS/DSFIELD': jsonapi_response.tos || jsonapi_response.dsfield
    });
  }

  if (jsonapi_response.preference) {
    table.push({
      'Preference': jsonapi_response.preference
    });
  }

  if (jsonapi_response.dev) {
    table.push({
      'Dev': jsonapi_response.dev
    });
  }

  if (jsonapi_response.src) {
    table.push({
      'Src': jsonapi_response.src
    });
  }

  if (jsonapi_response.scope) {
    table.push({
      'Scope': jsonapi_response.scope
    });
  }

  if (jsonapi_response.realm) {
    table.push({
      'Realm': jsonapi_response.realm
    });
  }

  if (jsonapi_response.mtu) {
    table.push({
      'MTU': jsonapi_response.mtu
    });
  }

  if (jsonapi_response.window) {
    table.push({
      'Window': jsonapi_response.window
    });
  }

  if (jsonapi_response.rtt) {
    table.push({
      'RTT': jsonapi_response.rtt
    });
  }
  if (jsonapi_response.rttvar) {
    table.push({
      'RTT var': jsonapi_response.rttvar
    });
  }

  if (jsonapi_response.rto_min) {
    table.push({
      'RTO min': jsonapi_response.rto_min
    });
  }

  if (jsonapi_response.ssthresh) {
    table.push({
      'SS thresh': jsonapi_response.ssthresh
    });
  }

  if (jsonapi_response.cwnd) {
    table.push({
      'Cwnd': jsonapi_response.cwnd
    });
  }

  if (jsonapi_response.initcwnd) {
    table.push({
      'Init cwnd': jsonapi_response.initcwnd
    });
  }

  if (jsonapi_response.initrwnd) {
    table.push({
      'Init rwnd': jsonapi_response.initrwnd
    });
  }

  if (jsonapi_response.quickack) {
    table.push({
      'Quick ack': jsonapi_response.quickack
    });
  }

  if (jsonapi_response.advmss) {
    table.push({
      'Advmss': jsonapi_response.advmss
    });
  }

  if (jsonapi_response.reordering) {
    table.push({
      'Reordering': jsonapi_response.reordering
    });
  }

  if (jsonapi_response.protocol) {
    table.push({
      'Protocol': jsonapi_response.protocol
    });
  }

  if (jsonapi_response.onlink) {
    table.push({
      'Onlink': jsonapi_response.onlink
    });
  }

  if (jsonapi_response.description) {
    table.push({
      'Description': jsonapi_response.description
    });
  }

  return table.toString();
};