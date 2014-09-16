var template = require('url-template');

exports.reserved_jsonapi_ids = [
  'linked',
  'links',
  'errors',
  'meta'
];

/**
 * Tells if a JSON+API response is link only or not.
 *
 * @param   {Object}    jsonapi_response
 * @returns {Boolean}
 */
exports.isResponseLinkOnly = function (jsonapi_response) {
  for (var prop in jsonapi_response) {
    if (jsonapi_response.hasOwnProperty(prop)) {
      // The property is not a reserved value so it must be a resource hence, not a link only.
      if (exports.reserved_jsonapi_ids.indexOf(prop) == -1) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Returns an array with the primary property values from all the resources
 * based on what parameter is in the URL template.
 *
 * @param   {Object}    jsonapi_response
 * @returns {Array}
 */
exports.getPrimaryPropertyValues = function (jsonapi_response) {
  var primary_values = [];

  for (var prop in jsonapi_response) {
    if (jsonapi_response.hasOwnProperty(prop)) {
      /*
       * The property is not a reserved value so it must be
       * a resource container hence, not a link only.
       */
      if (exports.reserved_jsonapi_ids.indexOf(prop) == -1) {
        // Gets the attribute/s name/s that needs to be processed.
        var url_template = jsonapi_response.links[prop];

        if (typeof url_template != 'undefined') {
          var last_segment = url_template.split('/').pop().replace(new RegExp(prop + '.', 'g'), '');
          var resource_template = template.parse(last_segment);

          // The actual resource/s container.
          var resource_container = jsonapi_response[prop];

          if (resource_container instanceof Array) {
            // Is a collection of resources.
            for (var i = 0, j = resource_container.length;
                 i < j;
                 i++) {

              primary_values.push(decodeURIComponent(resource_template.expand(resource_container[i])));
            }
          }
          else {
            /*
             * Is a single resource. Don't add completions for the same resource as
             * one will may think first, since it will add the last segment again,
             * But add nested resources if any.
             */
          }
        }
        else {
          /*
           * It is possible that the resource have nested resources,
           * so add them to the completion.
           */
          for (var k = 0, l = Object.keys(jsonapi_response.links).length;
               k < l;
               k++) {

            var nested_resource_id = Object.keys(jsonapi_response.links)[k].split(prop + '.')[1];
            primary_values.push(nested_resource_id);
          }
        }

        // Break cycle since it will be only one primary resource per API response.
        break;
      }
    }
  }
  return primary_values;
};