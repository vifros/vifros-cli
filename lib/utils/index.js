/**
 * Iterate recursively over an object.
 *
 * @param {Object}      object
 * @param {Array}       stack
 * @param {Function}    cb
 */
exports.iterate = function iterate(object, stack, cb) {
  for (var property in object) {
    if (object.hasOwnProperty(property)) {
      if (typeof object[property] == 'object') {
        /*
         * An inner object was found. Iterate recursively over it.
         */
        var new_stack = stack.concat(property);

        if (typeof cb == 'function') {
          cb(object[property], new_stack);
        }

        iterate(object[property], new_stack, cb);
      }
      else {
        // Not an inner object, so noop.
      }
    }
  }
};

/**
 * Find an inner property using a path within an object and return it.
 *
 * @param   {Object}    object
 * @param   {String}    path        A path to the object: 'a.path.to.the.object'
 * @returns {Object|null}
 */
exports.findProp = function findProp(object, path) {
  var args = path.split('.');
  var i;
  var l;

  for (i = 0, l = args.length; i < l; i++) {
    if (!object.hasOwnProperty(args[i]))
      return;
    object = object[args[i]];
  }
  return object;
};

/**
 * Set a value from a string path.
 * Usage: `set('a.b.c', 2, root_object);`
 *
 * @param path
 * @param value
 * @param root
 * @returns {*}
 */
exports.setProp = function (path, value, root) {
  var segments = path.split('.');
  var cursor = root || global;
  var segment;
  var i;

  for (i = 0; i < segments.length - 1; ++i) {
    segment = segments[i];
    cursor = cursor[segment] = cursor[segment] || {};
  }
  return cursor[segments[i]] = value;
};

exports.formatters = require('./formatters');
exports.jsonapi = require('./jsonapi');
exports.api_schema = require('./api-schema');