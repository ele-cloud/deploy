#!/usr/bin/env node

var commander = require('commander')

commander
  .option('-f, --force', 'force replace package', true)
  .requiredOption('-c, --company <company>')
  .requiredOption('-p, --project <project>')
  .option('--react', 'the default is vue project')
  .option('-d, --debug')
  .action(function (opts) {
    require('../lib/entry').execute({
      isForce: opts.force,
      isReact: opts.react,
      isDebug: opts.debug,
      company: opts.company,
      project: opts.project,
    })
  })

commander.parse(process.argv)
