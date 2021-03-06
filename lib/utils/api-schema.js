/**
 * Tells if a JSON+API response is link only or not.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @returns {Boolean}
 */
exports.isReferenceLinkOnly = function (reference) {
  /*
   * Is a link-only response if has only one GET method and
   * the GET method doesn't have a related `response`.
   */
  return (Object.keys(reference.methods).length == 1
  && reference.methods.hasOwnProperty('GET')
  && !reference.methods.GET.hasOwnProperty('response'));
};

/**
 * Tells if a JSON+API node has a dynamic children with specific instances.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @returns {Boolean}
 */
exports.hasDynamicChildrenWithInstances = function (reference) {
  if (!reference.children) {
    return false;
  }

  return Object.keys(reference.children).some(function (item) {
    // If has inner children then search for its instances.
    if (item.search(':') != -1) {
      // It is a dynamic segment.
      return reference.children[item].hasOwnProperty('instances');
    }

    return false;
  });
};

/**
 * Gets a reference to the dynamic child object of a parent node.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @returns {Object}
 */
exports.getDynamicChildReference = function (reference) {
  var instances_ref = {};

  Object.keys(reference.children).some(function (item) {
    // If has inner children then search for its instances.
    if (item.search(':') != -1) {
      // It is a dynamic segment.
      instances_ref = reference.children[item];
      return true;
    }

    return false;
  });

  return instances_ref;
};

/**
 * Tells if a JSON+API URL supports POST or not.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @returns {Boolean}
 */
exports.supportResourceCreation = function (reference) {
  /*
   * The API end-node supports resource creation if it has a related POST method.
   */
  return (reference.methods.hasOwnProperty('POST')
  && reference.methods.POST.hasOwnProperty('request'));
};

/**
 * Tells if a JSON+API URL supports DELETE or not.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @returns {Boolean}
 */
exports.supportResourceDeletion = function (reference) {
  /*
   * The API end-node supports resource deletion if it has a related DELETE method.
   */
  return (reference.methods.hasOwnProperty('DELETE'));
};

/**
 * Tells if a JSON+API URL supports PUT or not.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @returns {Boolean}
 */
exports.supportResourceUpdate = function (reference) {
  /*
   * The API end-node supports resource modification if it has a related PUT method.
   */
  return (reference.methods.hasOwnProperty('PUT'));
};

/**
 * Resolves a schema reference.
 *
 * @param   {Object}    reference         An api-schema section (a reference to it, to be precise).
 * @param   {Object}    schema            The full api-schema document.
 * @returns {Object}
 */
exports.resolveSchema = function (reference, schema) {
  var resolved_schema = {};

  /*
   * Process $ref.
   * Algorithm: replace parent with referenced object.
   */
  if (reference.hasOwnProperty('$ref')) {
    // Resolve $ref path.
    var ref = reference.$ref
      .replace('#/', '')
      .replace(/\//g, '/');

    resolved_schema = require('../utils/object').findProp(schema, ref, '/');
  }

  return resolved_schema;
};