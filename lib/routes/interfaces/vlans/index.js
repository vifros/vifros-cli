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
    head : ['Status/Operational', 'Status/Admin', 'Interface', 'Tag', 'Description'],
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

    var operational_status_color;
    if (jsonapi_response[i].status.operational == 'DOWN'
      || jsonapi_response[i].status.admin == 'LOWERLAYERDOWN') {

      operational_status_color = 'red';
    }
    else if (jsonapi_response[i].status.operational == 'NOTPRESENT') {
      operational_status_color = 'magenta';
    }
    else if (jsonapi_response[i].status.operational == 'UNKNOWN') {
      operational_status_color = 'blue';
    }
    else {
      operational_status_color = 'green';
    }

    var admin_status_color;
    if (jsonapi_response[i].status.admin == 'DOWN') {
      admin_status_color = 'red';
    }
    else if (jsonapi_response[i].status.admin == 'NOTPRESENT') {
      admin_status_color = 'magenta';
    }
    else {
      admin_status_color = 'green';
    }

    table.push([
      jsonapi_response[i].status.operational[operational_status_color],
      jsonapi_response[i].status.admin[admin_status_color],
      jsonapi_response[i].interface,
      jsonapi_response[i].tag,
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
  apischema_properties.status.properties.operational = null;
  delete apischema_properties.status.properties.operational;

  var custom_schema = {
    status: {
      properties: {
        admin: {
          message: 'Possible values are: UP or DOWN',
          conform: function (value) {
            return apischema_properties.status.properties.admin.enum.indexOf(value) != -1;
          }
        }
      }
    },
    tag   : {
      message: 'It has to be greater than 0 and less than 4095'
    }
  };

  return require('lodash').merge(apischema_properties, custom_schema);
};