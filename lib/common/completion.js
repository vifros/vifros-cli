var complete = require('complete');
var request = require('request');

var config = require('../../config/index');
var jsonapi = require('../utils/jsonapi');

var getCompletions = function getCompletions(words, prev, cur) {
  // Build an array from concatenated strings `complete` provides.
  var stack = words;
  /*
   * Removes the first two elements since they correspond to vifros {show|create|update|delete}
   * which are automatically completed due init object.
   */
  stack.splice(0, 2);
  /*
   * Removes the last element since it corresponds with empty or the current
   * command to be completed (and is incomplete, so it is useless).
   */
  stack.splice(-1);

  var url = (stack.length)
    ? stack.join('/')
    : '';

  // Since there are parameters that may contains invalid URI characters.
  for (var i = 0, j = stack.length;
       i < j;
       i++) {

    stack[i] = encodeURIComponent(stack[i]);
  }

  request({
    url    : config.api.url + '/' + url + '?limit=0',
    method : 'GET',
    headers: {
      'Content-Type': 'application/vnd.api+json'
    }
  }, function (error, response, body) {
    var parsed_body = JSON.parse(body);

    if (!error && response.statusCode == 200) {
      if (jsonapi.isResponseLinkOnly(parsed_body)) {
        // Is a link only response so add the menu items to the completion.
        complete.output(cur, Object.keys(parsed_body.links))
      }
      else {
        /*
         * Is is a dynamic path, so get the resources primary property and
         * adds them to the completion.
         */
        complete.output(cur, jsonapi.getPrimaryPropertyValues(parsed_body))
      }
    }
  });
};

complete({
  program : 'vifros',
  commands: {
    show  : getCompletions,
    create: getCompletions,
    update: getCompletions,
    delete: getCompletions
  },
  options : {
    '--help'   : {},
    '-h'       : {},
    '--version': {},
    '-v'       : {}
  }
});

complete.init();