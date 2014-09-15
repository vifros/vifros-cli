#!/usr/bin/env node
// TODO: Migrate to only `director` since `flatiron` is too much overload.
var path = require('path');
var flatiron = require('flatiron');

process.title = 'vifros';

var commands = require('../lib/commands');
var app = flatiron.app;

app.version = require('./../package.json').version;
app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

app.use(flatiron.plugins.cli, {
  version: true
});

// Load command completions.
require('./../lib/common/completion');

// Initialize commands.
commands.init(app);

app.start(function (error) {
  process.exit(error ? 1 : 0);
});