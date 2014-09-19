var Table = require('cli-table');

/**
 * Prints a help message detailing available commands and its descriptions.
 *
 * @param {Array}    stack              Array with the route to print help from.
 * @param {Object}   apidoc_section     The specific apidoc section whose this stack belongs to.
 */
module.exports = function (stack, apidoc_section) {
  var table = new Table({
    head : ['Command', 'Description'],
    chars: { 'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
      'bottom'    : '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
      'left'      : '', 'left-mid': '', 'mid': '', 'mid-mid': '',
      'right'     : '', 'right-mid': '',
      'middle'    : ' ' },
    style: {
      head           : ['yellow'],
      'padding-left' : 1,
      'padding-right': 1
    }
  });

  if (!stack.length) {
    // Was a top level command what failed.
    for (var top_level_cmd in apidoc_section) {
      if (apidoc_section.hasOwnProperty(top_level_cmd)) {
        table.push([
          top_level_cmd,
          apidoc_section[top_level_cmd].title
        ]);
      }
    }
  }
  else {
    // Was a route path what failed.
    if (apidoc_section.hasOwnProperty('children')) {
      for (var child in apidoc_section.children) {
        if (apidoc_section.children.hasOwnProperty(child)) {
          table.push([
            child,
            apidoc_section.children[child].title || ''
          ]);
        }
      }
    }

    if (apidoc_section.hasOwnProperty('instances')) {
      for (var instance in apidoc_section.instances) {
        if (apidoc_section.instances.hasOwnProperty(instance)) {
          table.push([
            instance,
            apidoc_section.instances[instance].title || ''
          ]);
        }
      }
    }
  }

  console.log(); // Top padding.
  console.log(' Usage:'.red + ' vifros' + ((stack.length) ? ' ' : '') + stack.join(' ') + ((table.length) ? ' [command]' : ''));

  if (table.length) {
    console.log(); // Padding.
    console.log(table.toString());
  }

  console.log();  // Bottom padding.
};