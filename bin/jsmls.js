#!/usr/bin/env node

var jsmt = require('../')
  , path = require('path')
  , optimist = require('optimist')
  , argv = optimist
    .usage('$0 <input>')
    .alias('r', 'resolve').default('r', 'amd').describe('r', 'resolution algorithm to use')
    .alias('U', 'allow-unresolved').default('U', false).describe('U', 'allow unresolved modules')
    .default('show-paths', false).describe('show-paths', 'show resolved paths')
    .alias('h', 'help')
    .demand(1)
    .argv

if (argv.help) {
  optimist.showHelp();
} else {
  jsmt.cli.list(argv._[0], {
    resolve: argv['resolve'],
    allowUnresolved: argv['allow-unresolved'],
    showPaths: argv['show-paths']
  });
}
