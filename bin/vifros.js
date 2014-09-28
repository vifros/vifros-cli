#!/usr/bin/env node
/*
 * Checks the command line arguments for presence of `compgen` (completion generation)
 * argument, which is the way `complete` module generates command completion to
 * be seed to bash.
 *
 * If this option is found, then the CLI app will terminate successfully since
 * no further actions will needed (it was executed only to gather completion info).
 *
 * This is an optimization to gain in speed for both completion and command execution
 * workflows.
 *
 */
if (process.argv.indexOf('--compgen') != -1) {
  // Load command completions.
  require('./../lib/completion');

  // Terminate the app successfully.
  process.exit(0);
}

// Set what is displayed in `ps`.
process.title = 'vifros';

/*
 * Initialize commands.
 * It will lazy-load all modules the specific command needs,
 * including commands themselves and routes.
 *
 * This is an optimization to increase the commands execution speed.
 */
require('./../lib/commands').init(function (error) {
  process.exit(error ? 1 : 0);
});

/*
 * Log uncaught errors and act accordingly.
 * http://shapeshed.com/uncaught-exceptions-in-node/
 */
process.on('uncaughtException', function cbOnUncaughtException(error) {
  console.error(error);

  // Exit the app with error status.
  process.exit(1);
});