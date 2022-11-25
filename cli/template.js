#!/usr/bin/env node
const { program } = require('commander');
const _actions = require('./_actions');

program
	.command('create')
	.description('Create a new template')
	.action(_actions.create)


program
	.command('pull')
	.description('pull the template from Github')
	.requiredOption('-u, --url <url>', 'Github URL to the template')
	.action(_actions.pull)

program.parse();