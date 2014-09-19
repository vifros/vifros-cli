exports.printFromJSONAPI = function (json_api, route) {
  var reserved_jsonapi_ids = [
    'linked',
    'links',
    'errors',
    'meta'
  ];

  console.log(); // Top padding.
  for (var i in json_api) {
    if (json_api.hasOwnProperty(i)) {
      if (reserved_jsonapi_ids.indexOf(i) != -1) {
        continue;
      }

      if (route.data.formatter) {
        // Custom formatter.
        console.log(route.data.formatter(json_api[i]));
      }
      else {
        console.log(json_api[i]);
      }
    }
  }
  console.log();  // Bottom padding.
};

/**
 * Outputs the object array that conforms the JSON+API response.
 *
 * @param   {Object}  json_api
 * @returns {Array}
 */
exports.getJSONAPIPayload = function (json_api) {
  var reserved_jsonapi_ids = [
    'linked',
    'links',
    'errors',
    'meta'
  ];

  var rows;
  for (var i in json_api) {
    if (json_api.hasOwnProperty(i)) {
      if (reserved_jsonapi_ids.indexOf(i) != -1) {
        continue;
      }

      rows = json_api[i];
      break;
    }
  }
  return rows;
};

exports.cliTableVerticalOptions = {
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
};