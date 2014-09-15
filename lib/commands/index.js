var utils = require('../utils');
var usage = require('../common').usage;

var routes = require('../routes');
var cmd_show = require('./show');
var cmd_create = require('./create');

exports.init = function (app) {
  // Version.
  app.cmd('version', function () {
    console.log(app.version);
  });

  app.router.notfound = function () {
    usage({
      object: routes,
      stack : []
    });
  };

  var cmd_flattened_show = [];
  var cmd_flattened_create = [];

  utils.iterate(routes, [], function (object, stack) {
    if (stack) {
      if (stack.indexOf('data') != -1) {
        return;
      }

      switch (stack[0]) {
        case 'show':
          cmd_flattened_show.push({
            object: object,
            stack : stack
          });
          break;

        case 'create':
          cmd_flattened_create.push({
            object: object,
            stack : stack
          });
          break;
      }
    }
  });

  // Looping backward.
  for (var i = cmd_flattened_show.length - 1;
       i >= 0;
       i--) {

    cmd_show(app, cmd_flattened_show[i]);
  }
  for (var i = cmd_flattened_create.length - 1;
       i >= 0;
       i--) {

    cmd_create(app, cmd_flattened_create[i]);
  }
};