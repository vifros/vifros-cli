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

// TODO: Migrate to only `director` since `flatiron` is too much overload.
var path = require('path');
var flatiron = require('flatiron');

process.title = 'vifros';

var commands = require('../lib/commands');
var app = flatiron.app;

app.version = require('./../package.json').version;
// TODO: The config line is really needed? It is somehow being used?
app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.cli, {
  version: true
});

// Initialize commands.
commands.init(app);

app.start(function (error) {
  process.exit(error ? 1 : 0);
});