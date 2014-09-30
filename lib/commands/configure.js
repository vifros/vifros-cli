// TODO: Add command completion.
// Monkey-patch String object with colors.
require('colors');

module.exports = function (cb) {
  console.log('Entering %s mode. Here you can execute commands without prepending them with `vifros`.', 'configure'.cyan);

  require('repl')
    .start({
      prompt         : 'vifros::local> ', // TODO: Adding `'local'.cyan` causes an ugly extra padding.
      input          : process.stdin,
      output         : process.stdout,
      terminal       : true,
      eval           : evalCommand,
      ignoreUndefined: true,
      writer         : writer
    })
    .on('exit', function () {
      console.log('Exiting %s mode.', 'configure'.cyan);
      cb(null);
    });
};

/**
 * Custom `eval` function to leverage the CLI functionality.
 *
 * @param {String}    cmd
 * @param {Object}    context
 * @param {String}    filename
 * @param {Function}  cb_eval
 */
function evalCommand(cmd, context, filename, cb_eval) {
  /*
   * By prepending 'vifros' to the cmd to be executed, we are shielding `exec()`
   * against execution of arbitrary commands besides vifros related ones.
   *
   * This is extra to the intended leverage of the already built CLI.
   */
  // Removes extra chars setted by the REPL.
  var new_cmd = cmd.replace(/\(|\)|\n/g, '');

  // Shielding agains re-execution of `configure` command.
  if (new_cmd.split(' ')[0] == 'configure') {
    console.log('You are already in %s mode.', 'configure'.cyan);
    cb_eval(null);
    return;
  }

  require('child_process').exec('vifros ' + new_cmd, function (error, stdout, stderror) {
    /*
     * Ignore `stderror`: `vifros` CLI is already handling that and outputing
     * to `stdout` a proper message to users.
     */
    cb_eval(null, stdout);
  });
}

/**
 * Custom `writer` function to get rid of `util.inspect()`.
 *
 * @param {String}  content
 * @return String}
 */
function writer(content) {
  return content;
}