#!/usr/bin/env node

var jsmt = require('../')
  , path = require('path')
  , optimist = require('optimist')
  , argv = optimist
    .usage('$0 <input> <output>')
    .alias('i', 'inline').default('i', true).describe('i', 'inline dependencies')
    .alias('r', 'resolve').default('r', 'amd').describe('r', 'resolution algorithm to use')
    .alias('U', 'allow-unresolved').default('U', false).describe('U', 'allow unresolved modules')
    .default('show-paths', false).describe('show-paths', 'show resolved paths')
    .alias('h', 'help')
    .demand(2)
    .argv

if (argv.help) {
  optimist.showHelp();
} else {
  jsmt.cli.build(argv._[0], argv._[1], {
    transitive: argv['inline'],
    resolve: argv['resolve'],
    allowUnresolved: argv['allow-unresolved'],
    showPaths: argv['show-paths']
  });
}
