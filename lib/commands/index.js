// TODO: Add support for options arguments.

var available_cmds = {
  show   : {
    title: 'Show information about the system and its resources.'
  },
  create : {
    title: 'Create new resources.'
  },
  version: {
    title : 'Show CLI app version.',
    simple: true
  }
};

// Dummy placeholder for the api. It will be filled if needed.
var apidoc = {};

exports.init = function (cb) {
  var cmd = process.argv[2];

  /*
   * Checks if the top level command exists.
   */
  if (!available_cmds.hasOwnProperty(cmd)) {
    /*
     * Is an invalid command.
     * Print usage info and exit the app.
     */
    require('../common/usage')([], available_cmds);

    cb(new Error('Command "%s" not found.'.replace('%s', cmd)));
    return;
  }

  // If the command doesn't need an apidoc routes, then execute it immediately.
  if (available_cmds[cmd].simple) {
    try {
      require('./' + cmd)(function (error) {
        if (error) {
          cb(error);
          return;
        }
        cb();
      });
    }
    catch (e) {
      cb(e);
    }
    return;
  }

  var api_route = process.argv.slice(3);

  // TODO: Make this path a configuration var, and let configure file paths or URLs.
  // TODO: Maybe compile the apidoc using the very same Angular method?
  apidoc = require('../../../vifros-api/public/api-docs.json');

  /*
   * Checks if the api routes exists.
   * If fully routes is not valid, print usage information for the last valid path.
   */
  var route_object = getAPIRouteObject(api_route);

  if (!route_object.valid) {
    /*
     * Is an invalid command.
     * Print usage info and exit the app.
     */
    require('../common/usage')([cmd].concat(route_object.stack), route_object.reference);

    cb(new Error('Path "%s" not found.'.replace('%s', api_route.join(' '))));
    return;
  }

  // Finally, lazy-load the specific command module and execute it.
  try {
    require('../commands/' + cmd)(api_route, route_object, function (error) {
      if (error) {
        cb(error);
        return;
      }
      cb();
    });
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Recursive function that traverses though a path and compare it to the docs to get the last valid path.
 *
 * Note: It needs a global `apidoc` variable to be present.
 *
 * @param {Array}   api_route              The routes path to be tested.
 * @param {Object}  reference_in_apidoc    A reference to the segment in the docs of the last valid path.
 * @param {Array}   stack                  The last valid routes path as the user typed it.
 * @param {Array}   stack_apidoc           The last valid routes path but with dynamic paths marked as such by its variable names.
 *
 * @return {Object} An object with the properties:
 *                  {Boolean}   valid       true if the whole routes path is valid, false otherwise.
 *                  {Object}    reference   A reference to the segment in the docs of the last valid path.
 *                  {Array}     stack       The last valid routes path.
 */
function getAPIRouteObject(api_route, reference_in_apidoc, stack, stack_apidoc) {
  // Initialize seed variables, if is the case.
  stack = stack || [];
  stack_apidoc = stack_apidoc || [];
  reference_in_apidoc = reference_in_apidoc || apidoc;

  if (!api_route.length) {
    // If gets here then was the routes was the top level one.
    return {
      valid       : false,
      reference   : reference_in_apidoc, // Return the apidoc root.
      stack       : stack,
      stack_apidoc: stack_apidoc
    };
  }

  /*
   * Detect property type that is in the apidoc.
   * Treat `children` & `instances` as mutually exclusive, but later
   * they could appear together, so watch for that case.
   */
  var nested_attribute;
  if (apidoc.hasOwnProperty('children')
    && apidoc.hasOwnProperty('instances')) {

    // The both of them are present, so throw an error to note that.
    // TODO: Add suppport for when both `children` & `instances` are present in apidoc.
    var error_msg = 'Both `children` & `instances` are present in docs. We are not prepared for that.';

    console.log(error_msg);
    throw new Error(error_msg);
  }
  else if (apidoc.hasOwnProperty('children')) {
    nested_attribute = 'children';
  }
  else if (apidoc.hasOwnProperty('instances')) {
    nested_attribute = 'instances';
  }
  else {
    // Neither of them are present, so the routes is invalid.
    return {
      valid       : false,
      reference   : reference_in_apidoc, // Return the last valid reference or the apidoc root.
      stack       : stack,
      stack_apidoc: stack_apidoc
    };
  }

  // Check for dynamic path.
  if (reference_in_apidoc[nested_attribute]) {
    var is_dynamic_path = Object.keys(reference_in_apidoc[nested_attribute])[0].charAt(0) == ':';
  }

  /*
   * The docs have a valid children/instance with that name.
   */
  if (is_dynamic_path
    || (reference_in_apidoc[nested_attribute] && reference_in_apidoc[nested_attribute].hasOwnProperty(api_route[0]))) {

    var new_reference;
    var new_dynamic_stack;
    if (is_dynamic_path) {
      var coded_property_name = Object.keys(reference_in_apidoc[nested_attribute])[0];
      new_reference = reference_in_apidoc[nested_attribute][coded_property_name];
      new_dynamic_stack = coded_property_name;
    }
    else {
      new_reference = reference_in_apidoc[nested_attribute][api_route[0]];
      new_dynamic_stack = api_route[0];
    }

    if (api_route.length > 1) {
      // There are more nested paths to test.
      return getAPIRouteObject(
        api_route.slice(1),                      // Remove the already evaluated path to go deep in nesting.
        new_reference,  // The new valid reference to be saved.
        stack.concat(api_route[0]),
        stack_apidoc.concat(new_dynamic_stack)
      );
    }

    /*
     * If length was equal to 1 it means there is no more paths to evaluate,
     * so return this reference as the last one, and mark it as a valid routes.
     */
    return {
      valid       : true,
      reference   : new_reference,
      stack       : stack.concat(api_route[0]),
      stack_apidoc: stack_apidoc.concat(new_dynamic_stack)
    };
  }

  /*
   * If continues to here, the docs don't have a valid child/instance with that name,
   * so return an invalid path.
   */
  return {
    valid       : false,
    reference   : reference_in_apidoc,
    stack       : stack,
    stack_apidoc: stack_apidoc
  };
}